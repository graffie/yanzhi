/**!
 * yanzhi - proxy/user.js
 */

'use strict';

/**
 * Module dependencies.
 */

var multiline = require('multiline');
var db = require('../common/mysql');
var utils = require('../lib/utils');
var only = require('only');

var GET_BY_ID_SQL = multiline(function () {;/*
  SELECT
    `users`.`id`,
    `users`.`gmt_create` AS `gmtCreate`,
    `users`.`gmt_modified` AS `gmtModified`,
    `users`.`mobile`,
    `users`.`name`,
    `users`.`password`
  FROM `users`
  WHERE `users`.`id` = ?
  LIMIT 1
*/});
exports.getById = function* (id) {
  return yield db.queryOne(GET_BY_ID_SQL, [id]);
};

var GET_BY_NAME_SQL = multiline(function () {;/*
  SELECT
    `users`.`id`,
    `users`.`gmt_create` AS `gmtCreate`,
    `users`.`gmt_modified` AS `gmtModified`,
    `users`.`mobile`,
    `users`.`name`,
    `users`.`password`
  FROM `users`
  WHERE `users`.`name` = ?
  LIMIT 1
*/});
exports.getByName = function* (name) {
  return yield db.queryOne(GET_BY_NAME_SQL, [name]);
};

exports.auth = function* (name, password) {
  var user = yield exports.getByName(name);
  if (!user) {
    return false;
  }
  var pass = yield utils.bcompare(password, user.password);
  return pass && user;
};

var ADD_SQL = 'INSERT INTO `users` SET ?';
exports.add = function* (user) {
  user.password = yield utils.bhash(user.password);
  user = only(user, 'mobile name password');
  user.gmt_create = new Date();
  user.gmt_modified = user.gmt_create;

  return yield db.query(ADD_SQL, [user]);
};
