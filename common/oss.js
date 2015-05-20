/**!
 * yanzhi - common/oss.js
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var oss = require('ali-oss');

module.exports = oss(config.oss);
