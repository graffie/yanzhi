/**!
 * yanzhi - test/controllers/feed.test.js
 */

'use strict';

/**
 * Module dependencies.
 */
var FeedsScore = require('../../proxy/feeds_score');
var Comment = require('../../proxy/comment');
var Store = require('../../common/oss');
var User = require('../../proxy/user');
var Feed = require('../../proxy/feed');
var request = require('supertest');
var app = require('../../app');
var should = require('should');
var mock = require('../mock');
var bytes = require('bytes');
var path = require('path');
var co = require('co');
var fs = require('fs');
var mm = require('mm');

var user;
var feeds = mock.feeds;
var agent;

var MOCK_PNG = fs.readFileSync(path.join(__dirname, '../fixtures/test.png'), 'base64');
var MOCK_JPG = fs.readFileSync(path.join(__dirname, '../fixtures/test.jpeg'), 'base64');
var MOCK_BASE64 = fs.readFileSync(path.join(__dirname, '../fixtures/test.base64'), 'utf8');

describe('controllers/feed.test.js', function () {

  before(function* (done) {
    user = yield User.getByName(mock.users[0].name);

    for (var i = 0; i < feeds.length; i++) {
      feeds[i].userId = user.id;
      var res = yield Feed.add(feeds[i]);
      feeds[i].id = res.insertId;
    }

    agent = request.agent(app);
    agent.post('/login')
    .send(mock.users[0]).end(done);
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
    it('should 422 when invalid params', function (done) {
      agent
      .post('/api/feed')
      .send({foo: 'bar'})
      .expect(422, done);
    });
    it('should 400 when invalid image type', function (done) {
      agent
      .post('/api/feed')
      .send({
        attachment: MOCK_JPG,
        contentType: 'image/gif',
      })
      .expect(422, done);
    });
    it.skip('should 400 when image too large', function (done) {
      var tmpLargeFile = new Buffer(bytes('11mb')).toString('base64');
      agent
      .post('/api/feed')
      .send({
        attachment: tmpLargeFile,
        contentType: 'image/jpg',
      })
      .expect(413, done);
    });
    it('should 500 when oss.put error', function (done) {
      mm.error(Store, 'put', 'mock oss.put error');
      agent
      .post('/api/feed')
      .send({
        attachment: MOCK_JPG,
        contentType: 'image/jpg',
      })
      .expect(500, done);
    });
    it('should 500 when Feed.add error', function (done) {
      mm.error(Feed, 'add', 'mock Feed.add error');
      agent
      .post('/api/feed')
      .send({
        attachment: MOCK_JPG,
        contentType: 'image/jpg',
      })
      .expect(500, done);
    });
    it('should 201 when png', function (done) {
      agent
      .post('/api/feed')
      .send({
        attachment: MOCK_PNG,
        contentType: 'image/png',
        content: 'unittest_feed_01',
        location: '杭州市西湖区',
      })
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.user_id.should.equal(user.id);
        res.body.user_name.should.equal(user.name);
        res.body.content.should.equal('unittest_feed_01');
        res.body.location.should.equal('杭州市西湖区');
        res.body.pic.should.be.a.String;
        done(err);
      })
    });
    it('should 201 when jpg', function (done) {
      agent
      .post('/api/feed')
      .send({
        attachment: MOCK_JPG,
        contentType: 'image/jpg',
        content: 'unittest_feed_02',
        lat: '32.321',
        location: '杭州市江干区',
      })
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.user_id.should.equal(user.id);
        res.body.user_name.should.equal(user.name);
        res.body.content.should.equal('unittest_feed_02');
        res.body.lat.should.equal('32.321');
        res.body.location.should.equal('杭州市江干区');
        res.body.pic.should.be.a.String;
        done(err);
      })
    });
    it('should 201 and remove image base64 header', function (done) {
      agent
      .post('/api/feed')
      .send({
        attachment: MOCK_BASE64,
        contentType: 'image/jpeg',
        content: 'unittest_feed_03',
        lat: '32.123',
        location: '长沙市开福区',
      })
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.user_id.should.equal(user.id);
        res.body.user_name.should.equal(user.name);
        res.body.content.should.equal('unittest_feed_03');
        res.body.lat.should.equal('32.123');
        res.body.location.should.equal('长沙市开福区');
        res.body.pic.should.be.a.String;
        done(err);
      })
    });
  });
  describe('DELETE /api/feed/:feedId', function () {
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
  describe('POST /api/feed/:feedId/vote', function () {

    it('should 422 when invalid vote type', function (done) {
      request(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'invalid'})
      .expect(422, done);
    });
    it('should 500 when Feed.getById error', function (done) {
      mm.error(Feed, 'getById', 'mock Feed.getById error');
      request(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'up'})
      .expect(500, done);
    });
    it('should 400 when feed not found', function (done) {
      mm.empty(Feed, 'getById');
      request(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'up'})
      .expect(400)
      .expect({message: 'feed not found'}, done);
    });
    it('should 500 when Feed.update error', function (done) {
      mm.error(Feed, 'update', 'mock Feed.update error');
      request(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'up'})
      .expect(500, done);
    });
    it('should 200 when no login', function (done) {
      request(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'down'})
      .expect(200)
      .end(function (err, res) {
        res.body.id.should.equal(feeds[1].id);
        res.body.score.should.equal(-5);
        co(function* () {
          var feed = yield Feed.getById(res.body.id);
          feed.score.should.equal(-5);
          var feedScores = yield FeedsScore.getByFeed(res.body.id);
          feedScores.length.should.equal(0);
          done(err);
        });
      });
    });
    it('should 200 when login', function (done) {
      agent
      .post('/api/feed/' + feeds[2].id + '/vote')
      .send({type: 'down'})
      .expect(200)
      .end(function (err, res) {
        res.body.id.should.equal(feeds[2].id);
        res.body.score.should.equal(-5);
        co(function* () {
          var feed = yield Feed.getById(res.body.id);
          feed.score.should.equal(-5);
          var feedScores = yield FeedsScore.getByFeed(res.body.id);
          feedScores.length.should.equal(1);
          feedScores[0].userId.should.equal(user.id);
          feedScores[0].score.should.equal(-5);
          done(err);
        });
      });
    });
  });
});
