/**!
 * yanzhi - test/controllers/feed.test.js
 */

'use strict';

/**
 * Module dependencies.
 */
var Comment = require('../../proxy/comment');
var User = require('../../proxy/user');
var Feed = require('../../proxy/feed');
var request = require('supertest');
var app = require('../../app');
var should = require('should');
var mock = require('../mock');
var mm = require('mm');

var user;
var feeds = mock.feeds;

describe('controllers/feed.test.js', function () {

  before(function* () {
    user = yield User.getByName(mock.users[0].name);

    for (var i = 0; i < feeds.length; i++) {
      feeds[i].userId = user.id;
      var res = yield Feed.add(feeds[i]);
      feeds[i].id = res.insertId;
    }
  });

  afterEach(mm.restore);

  describe('GET /api/feed', function () {
    it('should 500 when Feed.getLatest error', function (done) {
      mm.error(Feed, 'getLatest', 'mock Feed.getLatest error');
      request(app)
      .get('/api/feed')
      .expect(500, done);
    });
    it('should 200', function (done) {
      request(app)
      .get('/api/feed')
      .expect(200)
      .end(function (err, res) {
        res.body.should.be.an.Array;
        res.body.length.should.above(2);
        done(err);
      })
    });
  });

  describe('GET /api/feed/:feedId', function () {
    var comments = [
      {content: 'unittest mock comment 111'},
      {content: 'unittest mock comment 222'},
    ];
    var feedId;

    before(function* () {
      feedId = feeds[0].id;
      for (var i = 0; i < comments.length; i++) {
        var comment = comments[i];
        yield Comment.add({
          userId: user.id,
          feedId: feedId,
          content: comment.content,
        });
      }
    });

    it('should 500 when Feed.getById error', function (done) {
      mm.error(Feed, 'getById', 'mock Feed.getById error');
      request(app)
      .get('/api/feed/' + feedId)
      .expect(500, done);
    });
    it('should 500 when Comment.getByFeed error', function (done) {
      mm.error(Comment, 'getByFeed', 'mock Comment.getByFeed error');
      request(app)
      .get('/api/feed/' + feedId)
      .expect(500, done);
    });
    it('should 200', function (done) {
      request(app)
      .get('/api/feed/' + feedId)
      .expect(200)
      .end(function (err, res) {
        res.body.feed.should.be.an.Object;
        res.body.comments.should.be.an.Array;
        res.body.feed.id.should.equal(feedId);
        res.body.feed.user_id.should.equal(feeds[0].userId);
        res.body.feed.user_name.should.be.a.String;
        res.body.comments.length.should.equal(comments.length);
        done(err);
      })
    });
  });

  describe('POST /api/feed', function () {

    var agent;

    before(function (done) {
      agent = request.agent(app);
      agent.post('/login')
      .send(mock.users[0]).end(done);
    });

    it('should 500 when Feed.add error', function (done) {
      mm.error(Feed, 'add', 'mock Feed.add error');
      agent
      .post('/api/feed')
      .send(feeds[0])
      .expect(500, done);
    });

    it('should 201', function (done) {
      agent
      .post('/api/feed')
      .send(feeds[0])
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.user_id.should.equal(user.id);
        done(err);
      })
    });
  });
  describe('DELETE /api/feed/:feedId', function () {
    var agent;

    before(function (done) {
      agent = request.agent(app);
      agent.post('/login')
      .send(mock.users[0]).end(done);
    });

    it('should 500 when Feed.remove error', function (done) {
      mm.error(Feed, 'remove', 'mock Feed.remove error');
      agent
      .delete('/api/feed/' + feeds[0].id)
      .expect(500, done);
    });
    it('should 200', function (done) {
      agent
      .delete('/api/feed/' + feeds[0].id)
      .expect(200)
      .expect({id: feeds[0].id}, done);
    });
  });
});
