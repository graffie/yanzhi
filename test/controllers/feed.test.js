/**!
 * yanzhi - test/controllers/feed.test.js
 */

'use strict';

/**
 * Module dependencies.
 */
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
var fs = require('fs');
var mm = require('mm');

var user;
var feeds = mock.feeds;

var MOCK_GIF = path.join(__dirname, '../fixtures/test.gif');
var MOCK_PNG = path.join(__dirname, '../fixtures/test.png');
var MOCK_JPG = path.join(__dirname, '../fixtures/test.jpeg');

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
    var tmpFilePath = path.join(__dirname, '../fixtures/tmp_large.jpg');

    before(function (done) {
      // Generate a very large file.
      if (fs.existsSync(tmpFilePath)) {
        fs.unlinkSync(tmpFilePath);
      }
      fs.writeFileSync(tmpFilePath, new Buffer(bytes('11mb')));

      agent = request.agent(app);
      agent.post('/login')
      .send(mock.users[0]).end(done);
    });

    after(function () {
      fs.unlinkSync(tmpFilePath);
    });

    it('should 422 when invalid params', function (done) {
      agent
      .post('/api/feed')
      .send({foo: 'bar'})
      .expect(422)
      .expect({error: 'Unprocessable entity'}, done);
    });
    it('should 400 when invalid image type', function (done) {
      agent
      .post('/api/feed')
      .attach('upload', MOCK_GIF)
      .expect(400)
      .expect({error: 'Invalid image type'}, done);
    });
    it('should 400 when image too large', function (done) {
      agent
      .post('/api/feed')
      .attach('upload', tmpFilePath)
      .expect(413)
      .expect({error: 'Image too large'}, done);
    });
    it('should 500 when oss.put error', function (done) {
      mm.error(Store, 'put', 'mock oss.put error');
      agent
      .post('/api/feed')
      .field('content', 'unittest_feed_01')
      .attach('upload', MOCK_PNG)
      .expect(500, done);
    });
    it('should 500 when Feed.add error', function (done) {
      mm.error(Feed, 'add', 'mock Feed.add error');
      agent
      .post('/api/feed')
      .field('content', 'unittest_feed_01')
      .attach('upload', MOCK_PNG)
      .expect(500, done);
    });
    it('should 201 when png', function (done) {
      agent
      .post('/api/feed')
      .field('content', 'unittest_feed_01')
      .field('location', '杭州市西湖区')
      .attach('upload', MOCK_PNG)
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.user_id.should.equal(user.id);
        res.body.content.should.equal('unittest_feed_01');
        res.body.location.should.equal('杭州市西湖区');
        res.body.pic.should.be.a.String;
        done(err);
      })
    });
    it('should 201 when jpg', function (done) {
      agent
      .post('/api/feed')
      .field('content', 'unittest_feed_02')
      .field('lat', '123.321')
      .attach('upload', MOCK_JPG)
      .expect(201)
      .end(function (err, res) {
        res.body.id.should.above(0);
        res.body.user_id.should.equal(user.id);
        res.body.content.should.equal('unittest_feed_02');
        res.body.lat.should.equal('123.321');
        res.body.pic.should.be.a.String;
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
  describe('POST /api/feed/:feedId/vote', function () {

    it('should 422 when invalid vote type', function (done) {
      request.agent(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'invalid'})
      .expect(422, done);
    });
    it('should 500 when Feed.getById error', function (done) {
      mm.error(Feed, 'getById', 'mock Feed.getById error');
      request.agent(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'up'})
      .expect(500, done);
    });
    it('should 400 when feed not found', function (done) {
      mm.empty(Feed, 'getById');
      request.agent(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'up'})
      .expect(400)
      .expect({message: 'feed not found'}, done);
    });
    it('should 500 when Feed.update error', function (done) {
      mm.error(Feed, 'update', 'mock Feed.update error');
      request.agent(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'up'})
      .expect(500, done);
    });
    it('should 200', function (done) {
      request.agent(app)
      .post('/api/feed/' + feeds[1].id + '/vote')
      .send({type: 'down'})
      .expect(200)
      .end(function (err, res) {
        res.body.id.should.equal(feeds[1].id);
        res.body.score.should.equal(-5);
        require('co')(function* () {
          var feed = yield Feed.getById(res.body.id);
          feed.score.should.equal(-5);
          done(err);
        });
      });
    });
  });
});
