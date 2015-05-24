/**!
 * yanzhi - proxy/feeds_score.js
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
    `feeds_score`.`id`,
    `feeds_score`.`gmt_create` AS `gmtCreate`,
    `feeds_score`.`gmt_modified` AS `gmtModified`,
    `feeds_score`.`user_id` AS `userId`,
    `feeds_score`.`user_name` AS `userName`,
    `feeds_score`.`score`
  FROM `feeds_score`
  WHERE `feeds_score`.`feed_id` = ?
  ORDER BY `feeds_score`.`id` ASC
  LIMIT 100;
*/});
exports.getByFeed = function* (feedId) {
  return yield db.query(GET_BY_FEED_SQL, [feedId]);
};

var ADD_SQL = multiline(function () {;/*
  INSERT INTO `feeds_score` SET ?
  ON DUPLICATE KEY UPDATE ?;
*/});
exports.add = function* (feedScore) {
  feedScore = only(feedScore, 'feedId userId userName score');
  feedScore.gmtCreate = new Date();
  feedScore.gmtModified = feedScore.gmtCreate;
  feedScore = trans.camelToSnake(feedScore);

  var updateObj = only(feedScore, 'score gmtModified');

  return yield db.query(ADD_SQL, [feedScore, updateObj]);
};

var REMOVE_SQL = multiline(function () {;/*
  DELETE FROM `feeds_score`
  WHERE `feeds_score`.`feed_id` = ? AND `feeds_score`.`user_id` = ?;
*/});
exports.remove = function* (feedId, userId) {
  return yield db.query(REMOVE_SQL, [feedId, userId]);
};
