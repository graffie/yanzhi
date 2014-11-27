/**!
 * 5kw2 - common/logger.js
 */

'use strict';

/**
 * Module dependencies.
 */

var formatter = require('error-formatter');
var Logger = require('mini-logger');
var config = require('../config');

var isTEST = process.env.NODE_ENV === 'test';

var logger = module.exports = Logger({
  dir: config.logdir,
  duration: '1d',
  format: '[{category}.]YYYY-MM-DD[.log]',
  stdout: config.debug && !isTEST,
  errorFormater: formatter
});
