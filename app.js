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
var csrf = require('koa-csrf');
var path = require('path');
var http = require('http');
var koa = require('koa');

var isTest = process.env.NODE_ENV === 'test';

var app = koa();

app.keys = config.keys;
middlewares.onerror(app);
app.use(middlewares.bodyParser({jsonLimit: config.jsonLimit}));
app.use(override());
app.use(parameter(app));

app.use(middlewares.session({
  key: config.sessionKey,
  maxAge: ms('1d'),
  path: '/',
  store: middlewares.RedisStore(config.redis),
}));

if (!isTest) {
  csrf(app);
  app.use(csrf.middleware);
}

middlewares.ejs(app, {
  root: path.join(config.rootdir, 'client/dist'),
  layout: false,
  cache: config.viewCache,
  debug: config.debug,
  open: '{%',
  close: '%}'
});

if (config.debug) {
  if (!isTest) {
    app.use(middlewares.logger());
  }

  app.use(middlewares.staticCache(path.join(config.rootdir, 'client/dist/static'), {
    buffer: false,
    gzip: false,
    prefix: '/static'
  }));
} else {
  app.use(middlewares.staticCache(path.join(config.rootdir, 'client/dist/static'), {
    buffer: true,
    gzip: true,
    maxAge: ms('1d'),
    prefix: '/static'
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

app.on('error', function (err, ctx) {
  err.url = err.url || ctx.request.url;
  // console.log(err);
  // console.log(err.stack);
  logger.error(err);
  this.status = err.status || 500;
});

app = http.createServer(app.callback());
module.exports = app;
