/**!
 * yanzhi - controllers/user.js
 */

'use strict';

/**
 * Module dependencies.
 */

var Feed = require('../proxy/feed');
var User = require('../proxy/user');
var only = require('only');

exports.show = function* (next) {
  this.verifyParams({
    userId: 'id',
    offset: {type: 'number', required: false},
  });
  var userId = this.params.userId;
  var user = yield User.getById(userId);
  if (!user) {
    this.status = 400;
    this.body = {
      message: 'user not found',
    };
    return;
  }
  user = only(user, 'id name gmtCreate gmtModified');
  user.feeds = yield Feed.getByUser(userId, this.query.offset);

  this.status = 200;
  this.body = user;
};

exports.me = function* (next) {
  this.verifyParams({
    offset: {type: 'number', required: false},
  });
  var userId = this.user.id;
  var user = yield User.getById(userId);
  user = only(user, 'id name gmtCreate gmtModified');
  user.feeds = yield Feed.getByUser(userId, this.query.offset);

  this.status = 200;
  this.body = user;
};
