/**!
 * yanzhi - controllers/feed.js
 */

'use strict';

/**
 * Module dependencies.
 */
var Comment = require('../proxy/comment');
var Feed = require('../proxy/feed');
var only = require('only');

var props = [
  'pic',
  'content',
  'lng',
  'lat',
  'location',
];

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

exports.create = function* (next) {
  this.verifyParams({
    pic: 'string',
    content: {type: 'string', required: false},
    lng: {type: 'string', required: false},
    lat: {type: 'string', required: false},
    location: {type: 'string', required: false},
  });

  var feed = only(this.request.body, props);
  feed.userId = this.user.id;

  var res = yield Feed.add(feed);
  feed.id = res.insertId;
  this.status = 201;
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
