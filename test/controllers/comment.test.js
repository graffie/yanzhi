/**!
 * yanzhi - test/controllers/comment.test.js
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

var user = mock.users[0];
var feed = mock.feeds[0];
var commentId;
var agent;

describe('controllers/comment.test.js', function () {

  before(function* (done) {
    var _user = yield User.getByName(user.name);
    user.id = _user.id;

    feed.userId = user.id;
    var res = yield Feed.add(feed);
    feed.id = res.insertId;

    agent = request.agent(app);
    agent.post('/login')
    .send(user).end(done);
  });

  afterEach(mm.restore);

  describe('POST /api/feed/:feedId/comment', function () {

    it('should 422 when content missed', function (done) {
      agent
      .post('/api/feed/' + feed.id + '/comment')
      .send({content: 0})
      .expect(422, done);
    });
    it('should 500 when Comment.add error', function (done) {
      mm.error(Comment, 'add', 'mock Comment.add error');
      agent
      .post('/api/feed/' + feed.id + '/comment')
      .send({content: 'unittest mock comment'})
      .expect(500, done);
    });
    it('should 201 when ok', function (done) {
      agent
      .post('/api/feed/' + feed.id + '/comment')
      .send({content: 'unittest mock comment'})
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.feed_id.should.equal(feed.id);
        res.body.content.should.equal('unittest mock comment');
        res.body.user_id.should.equal(user.id);
        res.body.user_name.should.equal(user.name);
        commentId = res.body.id;
        done(err);
      });
    });
    it('should 201 when no login', function (done) {
      request(app)
      .post('/api/feed/' + feed.id + '/comment')
      .send({content: 'unittest mock comment222'})
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.feed_id.should.equal(feed.id);
        res.body.content.should.equal('unittest mock comment222');
        res.body.user_id.should.equal(0);
        res.body.user_name.should.equal('');
        done(err);
      });
    });
  });

  describe('DELETE /api/feed/:feedId/comment/:commentId', function () {
    it('should 500 when Comment.remove error', function (done) {
      mm.error(Comment, 'remove', 'mock Comment.remove error');
      agent
      .delete('/api/feed/' + feed.id + '/comment/' + commentId)
      .expect(500, done);
    });
    it('should 200', function (done) {
      agent
      .delete('/api/feed/' + feed.id + '/comment/' + commentId)
      .expect(200)
      .expect({id: commentId}, done);
    });
  });
});
