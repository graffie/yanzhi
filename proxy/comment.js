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

var GET_BY_FEED_SQL = multiline(function () {;/*
  SELECT
    `comments`.`id`,
    `comments`.`gmt_create` AS `gmtCreate`,
    `comments`.`gmt_modified` AS `gmtModified`,
    `comments`.`user_id` AS `userId`,
    `comments`.`user_name` AS `userName`,
    `comments`.`content`
  FROM `comments`
  WHERE `comments`.`feed_id` = ?
  ORDER BY `comments`.`id` ASC
*/});
exports.getByFeed = function* (feedId) {
  return yield db.query(GET_BY_FEED_SQL, [feedId]);
};

var ADD_SQL = 'INSERT INTO `comments` SET ?';
exports.add = function* (comment) {
  comment = only(comment, 'feedId userId userName content');
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
