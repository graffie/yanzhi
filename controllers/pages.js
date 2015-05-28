/**!
 * yanzhi - controllers/pages.js
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');

exports.index = function* (next) {
  var csrf = this.csrf;
  yield this.render('index', {
    version: config.version,
    current: new Date(),
    csrf: csrf,
  });
};
