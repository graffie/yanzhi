/**!
 * 5kw2 - proxy/feed.js
 */

'use strict';

/**
 * Module dependencies.
 */

var multiline = require('multiline');
var db = require('../common/mysql');

var GET_SQL = multiline(function () {;/*
  SELECT
    `feeds`.`id`,
    `feeds`.`gmt_create`,
    `feeds`.`gmt_modified`,
    `feeds`.`content`,
    `feeds`.`user_nick`,
    `feeds`.`lng`,
    `feeds`.`lat`,
    `feeds`.`geo_info`
  FROM
    `feeds`
  WHERE
    `feeds`.`lng` >= ? AND
    `feeds`.`lng` <= ? AND
    `feeds`.`lat` >= ? AND
    `feeds`.`lat` <= ?
  ORDER BY `feeds`.`gmt_create` ASC
  LIMIT 100
*/});
exports.get = function* (obj) {
  var values = [
    obj.lngmin,
    obj.lngmax,
    obj.latmin,
    obj.latmax
  ];
  return yield db.query(GET_SQL, values);
};

var ADD_SQL = multiline(function () {;/*
  INSERT INTO `feeds`
  ( `feeds`.`content`,
    `feeds`.`user_nick`,
    `feeds`.`user_info`,
    `feeds`.`lng`,
    `feeds`.`lat`,
    `feeds`.`geo_info`,
    `feeds`.`gmt_create`,
    `feeds`.`gmt_modified`)
  VALUES
  (?, ?, ?, ?, ?, ?, NOW(), NOW())
*/});
exports.add = function* (feed) {
  var values = [
    feed.content,
    feed.userNick,
    feed.userInfo,
    feed.lng,
    feed.lat,
    feed.geoInfo,
  ];
  return yield db.query(ADD_SQL, values);
};
