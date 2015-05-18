/**!
 * yanzhi - common/mysql.js
 */

'use strict';

/**
 * Module dependencies.
 */

var thunkify = require('thunkify-wrap');
var config = require('../config');
var ready = require('ready');
var mysql = require('mysql');

// TODO: query timeout
var pool = mysql.createPool(config.mysql);

exports.pool = pool;

exports.query = function (sql, values, cb) {
  if (typeof values === 'function') {
    cb = values;
    values = null;
  }
  pool.query(sql, values, function (err, rows) {
    cb(err, rows);
  });
};

exports.queryOne = function (sql, values, cb) {
  if (typeof values === 'function') {
    cb = values;
    values = null;
  }
  exports.query(sql, values, function (err, rows) {
    if (rows) {
      rows = rows[0];
    }
    cb(err, rows);
  });
};

exports.escape = function (val) {
  return pool.escape(val);
};

ready(exports);

thunkify(exports);

function init() {
  exports.query('show tables', function (err, rows) {
    if (err) {
      console.error('[%s] [worker:%s] mysql init error: %s', Date(), process.pid, err);
      setTimeout(init, 1000);
      return;
    }
    console.log('[%s] [worker:%s] mysql ready, got %d tables', Date(), process.pid, rows.length);
    exports.ready(true);
  });
}
init();
