/**!
 * yanzhi - controllers/pages.js
 */

'use strict';

/**
 * Module dependencies.
 */

exports.index = function* (next) {
  yield this.render('home', {
    current: new Date(),
  });
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
