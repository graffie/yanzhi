/**!
 * yanzhi - controllers/feed.js
 */

'use strict';

/**
 * Module dependencies.
 */
var Comment = require('../proxy/comment');
var toArray = require('stream-to-array');
var Store = require('../common/oss');
var Feed = require('../proxy/feed');
var parse = require('co-busboy');
var utils = require('utility');
var bytes = require('bytes');
var path = require('path');
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
  };
  this.status = 200;
  this.body = r;
};

function uid() {
  return Math.random().toString(36).slice(2);
}

exports.create = function* (next) {
  var parts;
  try {
    parts = parse(this, {
      autoFields: true,
      headers: this.headers,
      defCharset: 'utf8',
      limits: {
        fileSize: bytes('20mb'),
        files: 1,
      },
      checkFile: function (fieldname, file, filename) {
        if (fileTypes.indexOf(path.extname(filename)) < 0) {
          var err = new Error('Invalid image type');
          err.status = 400;
          return err;
        }
      },
    });
  } catch (ex) {
    this.status = 422;
    this.body = {error: 'Unprocessable entity'};
    return;
  }

  var part;
  try {
    part = yield parts;
  } catch (ex) {
    this.status = ex.status || 422;
    this.body = {error: ex.message};
    return;
  }
  var buf = Buffer.concat(yield toArray(part));
  if (buf.length > bytes('10mb')) {
    this.status = 413;
    this.body = {error: 'Image too large'};
    return;
  }

  var fileName = uid() + utils.base64encode(part.filename);
  var userId = this.user.id;
  var object = yield Store.put(userId + '/' + fileName, buf);

  var picUrl = 'http://' +
                Store.options.bucket + '.' + Store.options.host +
                '/' + object.name;

  var feed = only(parts.field, props);
  feed.pic = picUrl;
  feed.userId = userId;

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
