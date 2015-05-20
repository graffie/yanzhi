/**!
 * yanzhi - proxy/feed.js
 */

'use strict';

/**
 * Module dependencies.
 */

var multiline = require('multiline');
var db = require('../common/mysql');
var trans = require('var-style');
var only = require('only');

var GET_LATEST_SQL = multiline(function () {;/*
  SELECT
    `feeds`.`id`,
    `feeds`.`gmt_create` AS `gmtCreate`,
    `feeds`.`gmt_modified` AS `gmtModified`,
    `feeds`.`user_id` AS `userId`,
    `users`.`name` AS `userName`,
    `feeds`.`lng`,
    `feeds`.`lat`,
    `feeds`.`location`,
    `feeds`.`pic`,
    `feeds`.`content`,
    `feeds`.`score`
  FROM `feeds`
  LEFT OUTER JOIN `users`
  ON `users`.`id` = `feeds`.`user_id`
  ORDER BY `feeds`.`gmt_create` ASC
  LIMIT ?, 100
*/});
exports.getLatest = function* (offset) {
  if (typeof offset !== 'number') {
    offset = 0;
  }
  return yield db.query(GET_LATEST_SQL, [offset]);
};

var GET_BY_USER_SQL = multiline(function () {;/*
  SELECT
    `feeds`.`id`,
    `feeds`.`gmt_create` AS `gmtCreate`,
    `feeds`.`gmt_modified` AS `gmtModified`,
    `feeds`.`lng`,
    `feeds`.`lat`,
    `feeds`.`location`,
    `feeds`.`pic`,
    `feeds`.`content`,
    `feeds`.`score`
  FROM
    `feeds`
  WHERE
    `feeds`.`user_id` = ?
  ORDER BY `feeds`.`gmt_create` ASC
  LIMIT ?, 100
*/});
exports.getByUser = function* (userId, offset) {
  if (typeof offset !== 'number') {
    offset = 0;
  }
  return yield db.query(GET_BY_USER_SQL, [userId, offset]);
};

var GET_BY_ID_SQL = multiline(function () {;/*
  SELECT
    `feeds`.`id`,
    `feeds`.`gmt_create` AS `gmtCreate`,
    `feeds`.`gmt_modified` AS `gmtModified`,
    `feeds`.`user_id` AS `userId`,
    `users`.`name` AS `userName`,
    `feeds`.`lng`,
    `feeds`.`lat`,
    `feeds`.`location`,
    `feeds`.`pic`,
    `feeds`.`content`,
    `feeds`.`score`
  FROM `feeds`
  LEFT OUTER JOIN `users`
  ON `users`.`id` = `feeds`.`user_id`
  WHERE `feeds`.`id` = ?
  LIMIT 1
*/});
exports.getById = function* (feedId) {
  return yield db.queryOne(GET_BY_ID_SQL, [feedId]);
};

var ADD_SQL = 'INSERT INTO `feeds` SET ?';
exports.add = function* (feed) {
  feed = only(feed, 'userId lng lat location pic content');
  feed.gmtCreate = new Date();
  feed.gmtModified = feed.gmtCreate;
  feed = trans.camelToSnake(feed);

  return yield db.query(ADD_SQL, [feed]);
};

var REMOVE_SQL = multiline(function () {;/*
  DELETE FROM `feeds`
  WHERE `feeds`.`id` = ? AND `feeds`.`user_id` = ?
*/});
exports.remove = function* (feedId, userId) {
  return yield db.query(REMOVE_SQL, [feedId, userId]);
};

var UPDATE_SQL = multiline(function () {;/*
  UPDATE
    `feeds`
  SET
    ?
  WHERE `feeds`.`id` = ?
*/});
exports.update = function* (feedId, feed) {
  feed = only(feed, 'score');
  feed.gmtModified = new Date();
  feed = trans.camelToSnake(feed);
  return yield db.query(UPDATE_SQL, [feed, feedId]);
};
