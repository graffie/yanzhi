/**!
 * yanzhi - app.js
 */

'use strict';

/**
 * Module dependencies.
 */

var transform = require('./middlewares/transform');
var override = require('koa-methodoverride');
var middlewares = require('koa-middlewares');
var parameter = require('koa-parameter');
var logger = require('./common/logger');
var config = require('./config');
var routes = require('./routes');
var ms = require('humanize-ms');
var path = require('path');
var http = require('http');
var koa = require('koa');

var isTest = process.env.NODE_ENV === 'test';

var app = koa();

app.keys = config.keys;

middlewares.onerror(app);
app.use(middlewares.bodyParser());
app.use(override());
app.use(parameter(app));

app.use(middlewares.session({
  key: config.sessionKey,
  maxAge: ms('1d'),
  path: '/'
}));

var locals = {
  version: config.version
};

middlewares.ejs(app, {
  root: path.join(config.rootdir, 'views'),
  layout: false,
  cache: config.viewCache,
  debug: config.debug,
  locals: locals,
  open: '{%',
  close: '%}'
});

if (config.debug) {
  if (!isTest) {
    app.use(middlewares.logger());
  }

  app.use(middlewares.staticCache(path.join(config.rootdir, 'assets'), {
    buffer: false,
    gzip: false,
    prefix: '/assets'
  }));
} else {
  app.use(middlewares.staticCache(path.join(config.rootdir, 'assets'), {
    buffer: true,
    gzip: true,
    maxAge: ms('1d'),
    prefix: '/assets'
  }));
}

app.use(transform());

app.use(function* ensureUser(next) {
  this.user = this.session.user || {};
  yield next;
});

/**
 * Routes
 */
routes(app);

app.on('error', function (err) {
  if (isTest) {
    console.error(err);
    return;
  }
  logger.error(err);
});

app = http.createServer(app.callback());
module.exports = app;
