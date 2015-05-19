/**!
 * yanzhi - proxy/comment.js
 */

'use strict';

/**
 * Module dependencies.
 */

var multiline = require('multiline');
var db = require('../common/mysql');
var trans = require('var-style');
var only = require('only');

var ADD_SQL = 'INSERT INTO `comments` SET ?';
exports.add = function* (comment) {
  comment = only(comment, 'feedId userId content');
  comment.gmtCreate = new Date();
  comment.gmtModified = comment.gmtCreate;
  comment = trans.camelToSnake(comment);

  return yield db.query(ADD_SQL, [comment]);
};

var REMOVE_SQL = multiline(function () {;/*
  DELETE FROM `comments`
  WHERE `comments`.`id` = ? AND `comments`.`user_id` = ?
*/});
exports.remove = function* (commentId, userId) {
  return yield db.query(REMOVE_SQL, [commentId, userId]);
};
