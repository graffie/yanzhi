/**!
 * yanzhi - test/init.js
 */

'use strict';

/**
 * Module dependencies.
 */

var User = require('../proxy/user');
var mock = require('./mock');
var co = require('co');

co(function* () {
  for (var i = 0; i < mock.users.length; i++) {
    yield User.add(mock.users[i]);
  }
  process.exit(0);
}).catch(function (err) {
  console.log(err.stack);
  process.exit(1);
});
