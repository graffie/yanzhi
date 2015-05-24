/**!
 * yanzhi - controllers/pages.js
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var path = require('path');
var send = require('koa-send');

exports.index = function* (next) {
  yield send(this, path.join(config.rootdir, 'client/dist/index.html'));
};

exports.home = function* (next) {
  yield this.render('home', {
    current: new Date(),
  });
};

exports.login = function* (next) {
  yield this.render('login', {
    current: new Date(),
  });
};
