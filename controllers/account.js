/**!
 * yanzhi - controllers/account.js
 */

'use strict';

/**
 * Module dependencies.
 */

var User = require('../proxy/user');
var parse = require('url').parse;

exports.login = function* () {
  if (!this.request.body.name || !this.request.body.password) {
    return this.body = {
      status: 400,
      message: 'parameter missed'
    };
  }

  var user = yield User.auth(this.request.body.name, this.request.body.password);
  if (!user) {
    return this.body = {
      status: 400,
      message: 'authorization failed'
    };
  }

  var redirect = parse(this.request.body.redirect || '/');
  redirect = redirect.host || redirect.protocol
    ? '/'
    : (redirect.path || '/');

  // Set session
  delete user.password;
  delete user.mobile;
  this.session.user = user;
  this.body = {
    status: 200,
    user: user,
    redirect: redirect,
  };
};

exports.logout = function* () {
  this.session = null;
  this.redirect('/');
};

exports.join = function* () {
  if (this.session.user) {
    return this.body = {
      status: 400,
      message: 'already login'
    };
  }

  try {
    yield User.add(this.request.body);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return this.body = {
        status: 400,
        message: 'duplicate error'
      };
    }
    throw err;
  }

  this.session.user = yield User.getByName(this.request.body.name);
  this.body = {
    status: 200
  };
};
