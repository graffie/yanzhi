/**!
 * 5kw2 - routes.js
 */

'use strict';

/**
 * Module dependencies.
 */

var middlewares = require('koa-middlewares');
var index = require('./controllers/index');
var feed = require('./controllers/feed');
var mount = require('koa-mount');
var koa = require('koa');

module.exports = function (app) {
  app.use(middlewares.router(app));

  // Pages
  app.get('/', index.home);

  // API
  app.use(mount('/api', API));
};

/**
 * restful API
 * @type {[type]}
 */

var API = koa();

var Resource = middlewares.ResourceRouter;
var feedResource = new Resource('feeds', feed, {id: 'feedId'});

API.use(feedResource.middleware());
