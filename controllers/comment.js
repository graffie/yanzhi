/**!
 * yanzhi - controllers/comment.js
 */

'use strict';

/**
 * Module dependencies.
 */

var Comment = require('../proxy/comment');

exports.create = function* (next) {
  this.verifyParams({
    feedId: 'id',
    content: 'string',
  });

  var comment = {};
  comment.feedId = Number(this.params.feedId);
  comment.content = this.request.body.content;
  comment.userId = this.user.id || 0;

  var res = yield Comment.add(comment);
  comment.id = res.insertId;
  this.status = 201;
  this.body = comment;
};

exports.destroy = function* (next) {
  this.verifyParams({
    feedId: 'id',
    commentId: 'id',
  });

  var commentId = Number(this.params.commentId);
  var userId = this.user.id;

  yield Comment.remove(commentId, userId);
  this.status = 200;
  this.body = {
    id: commentId
  };
};
