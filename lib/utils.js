/**!
 * yanzhi - lib/utils.js
 */

'use strict';

/**
 * Module dependencies.
 */

var thunkify = require('thunkify-wrap');
var config = require('../config');
var bcrypt = require('bcrypt');

thunkify(bcrypt, ['hash', 'compare']);

/**
 * use bcrypt to hash the string
 * @param {String} str
 * @return {String}
 */

exports.bhash = function* (str) {
  return yield bcrypt.hash(str, config.hashLength);
};

/**
 * use bcrypt to compare the string with hash
 * @param {String} str
 * @param {String} hash
 * @return {Boolean}
 */

exports.bcompare = function* (str, hash) {
  return yield bcrypt.compare(str, hash);
};
