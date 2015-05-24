/**!
 * yanzhi - controllers/feed.js
 */

'use strict';

/**
 * Module dependencies.
 */
var FeedsScore = require('../proxy/feeds_score');
var Comment = require('../proxy/comment');
var Store = require('../common/oss');
var Feed = require('../proxy/feed');
var config = require('../config');
var bytes = require('bytes');
var only = require('only');

var props = [
  'pic',
  'content',
  'lng',
  'lat',
  'location',
];
var fileTypes = ['.jpg', '.png', '.jpeg'];

exports.index = function* (next) {
  this.status = 200;
  this.body = yield Feed.getLatest();
};

exports.show = function* (next) {
  this.verifyParams({
    feedId: 'id',
  });

  var feedId = Number(this.params.feedId);
  var r = yield {
    feed: Feed.getById(feedId),
    comments: Comment.getByFeed(feedId),
    scores: FeedsScore.getByFeed(feedId),
  };
  this.status = 200;
  this.body = r;
};

function uid() {
  return Math.random().toString(36).slice(2);
}

exports.create = function* (next) {
  this.verifyParams({
    attachment: 'string',
    contentType: ['image/png', 'image/jpg', 'image/jpeg'],
    content: {type: 'string', required: false},
    lng: {type: 'string', required: false},
    lat: {type: 'string', required: false},
    location: {type: 'string', required: false},
  });

  var body = this.request.body;
  var attachment = body.attachment;
  var contentType = body.contentType;
  var meta = 'data:' + contentType + ';base64,';

  if (attachment.substring(0, meta.length) === meta) {
    attachment = attachment.slice(meta.length);
  }

  var buf = new Buffer(attachment, 'base64');
  var fileName = Date.now() + uid();
  var userId = this.user.id;
  var object = yield Store.put(userId + '/' + fileName, buf, {
    mime: contentType,
    meta: { uid: userId }
  });

  var feed = only(body, props);
  feed.pic = 'http://' + config.imageStore + '/' + object.name;
  feed.userId = userId;
  feed.userName = this.user.name;

  var res = yield Feed.add(feed);
  feed.id = res.insertId;
  this.status = 201;
  this.body = feed;
};

exports.vote = function* (next) {
  this.verifyParams({
    feedId: 'id',
    type: ['up', 'down'],
  });
  var feedId = this.params.feedId;
  var feed = yield Feed.getById(feedId);
  if (!feed) {
    this.status = 400;
    this.body = {
      message: 'feed not found',
    };
    return;
  }
  var score = this.request.body.type === 'up' ? 5 : -5;
  feed.score = feed.score + score;
  var res = yield Feed.update(feedId, {score: feed.score});
  if (this.user.id) {
    yield FeedsScore.add({
      feedId: feedId,
      userId: this.user.id,
      userName: this.user.name,
      score: feed.score,
    });
  }
  this.status = 200;
  this.body = feed;
};

exports.destroy = function* (next) {
  this.verifyParams({
    feedId: 'id',
  });

  var feedId = Number(this.params.feedId);
  var userId = this.user.id;

  yield Feed.remove(feedId, userId);

  this.status = 200;
  this.body = {
    id: feedId
  };
};
