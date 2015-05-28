/**!
 * yanzhi - controllers/account.js
 */

'use strict';

/**
 * Module dependencies.
 */

var User = require('../proxy/user');
var parse = require('url').parse;

function parseRedirect(redirect) {
  redirect = redirect || '/';
  var result = parse(redirect);
  result = (result.host || result.protocol)
    ? '/'
    : (result.path || '/');
  return result;
}

exports.login = function* () {
  if (!this.request.body.name || !this.request.body.password) {
    return this.body = {
      status: 400,
      message: 'parameter missed'
    };
  }

  if (typeof this.request.body.name === 'string') {
    this.request.body.name = this.request.body.name.toLowerCase();
  }

  var user = yield User.auth(this.request.body.name, this.request.body.password);
  if (!user) {
    return this.body = {
      status: 400,
      message: 'authorization failed'
    };
  }

  // Set session
  delete user.password;
  delete user.mobile;
  this.session.user = user;
  this.body = {
    status: 200,
    user: user,
    redirect: parseRedirect(this.request.body.redirect),
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

  if (typeof this.request.body.name === 'string') {
    this.request.body.name = this.request.body.name.toLowerCase();
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

  var user = yield User.getByName(this.request.body.name);
  // Set session
  delete user.password;
  delete user.mobile;
  this.session.user = user;
  this.body = {
    status: 200,
    user: user,
    redirect: parseRedirect(this.request.body.redirect),
  };
};
