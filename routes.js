/**!
 * yanzhi - routes.js
 */

'use strict';

/**
 * Module dependencies.
 */

var middlewares = require('koa-middlewares');
var account = require('./controllers/account');
var comment = require('./controllers/comment');
var weixin = require('./controllers/weixin');
var pages = require('./controllers/pages');
var feed = require('./controllers/feed');
var user = require('./controllers/user');
var auth = require('./middlewares/auth');

module.exports = function (app) {
  app.use(middlewares.router(app));

  // 页面
  app.get('/', pages.index);
  app.get('/home', pages.home);
  app.get('/login', pages.login);

  // 登录相关的接口
  // app.post('/verify_code', account.verifyCode);
  app.post('/login', account.login);
  app.post('/logout', account.logout);
  app.post('/join', account.join);

  app.get('/sys/weixin/token', weixin.token);

  // API
  app.get('/api/user/:userId', user.show);
  app.get('/api/me', auth, user.me);

  app.get('/api/feed', feed.index);
  app.get('/api/feed/:feedId', feed.show);
  app.post('/api/feed', auth, feed.create);
  app.delete('/api/feed/:feedId', auth, feed.destroy);
  app.post('/api/feed/:feedId/vote', feed.vote);

  app.post('/api/feed/:feedId/comment', comment.create);
  app.delete('/api/feed/:feedId/comment/:commentId', auth, comment.destroy);
};
