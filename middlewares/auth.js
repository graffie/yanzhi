/**!
 * yanzhi - middlewares/auth.js
 */

'use strict';

/**
 * Module dependencies.
 */

module.exports = function* auth(next) {
  var user = this.session.user;
  if (!user) {
    return this.status = 403;
  }

  this.user = user;
  yield* next;
};
