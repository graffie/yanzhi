/**!
 * 5kw2 - controllers/index.js
 */

'use strict';

/**
 * Module dependencies.
 */

exports.home = function* (next) {
  yield this.render('home', {
    current: new Date()
  });
};
