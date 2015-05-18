/**!
 * yanzhi - routes.js
 */

'use strict';

/**
 * Module dependencies.
 */

var middlewares = require('koa-middlewares');
var index = require('./controllers/index');
var feed = require('./controllers/feed');

module.exports = function (app) {
  app.use(middlewares.router(app));

  // Pages
  app.get('/', index.home);

  // API
  app.get('/api/feed', feed.index);
  app.post('/api/feed', feed.create);
};
