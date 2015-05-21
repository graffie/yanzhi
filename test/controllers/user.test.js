/**!
 * yanzhi - test/controllers/user.test.js
 */

'use strict';

/**
 * Module dependencies.
 */

var User = require('../../proxy/user');
var Feed = require('../../proxy/feed');
var request = require('supertest');
var app = require('../../app');
var should = require('should');
var mock = require('../mock');
var mm = require('mm');

var user;
var feeds = mock.feeds;

describe('controllers/user.test.js', function () {

  before(function* () {
    user = yield User.getByName(mock.users[0].name);

    for (var i = 0; i < feeds.length; i++) {
      feeds[i].userId = user.id;
      var res = yield Feed.add(feeds[i]);
      feeds[i].id = res.insertId;
    }
  });

  afterEach(mm.restore);

  describe('GET /api/user/:userId', function () {
    it('should 422 when invalid userId', function (done) {
      request(app)
      .get('/api/user/x123')
      .expect(422, done);
    });
    it('should 500 when User.getById error', function (done) {
      mm.error(User, 'getById', 'mock User.getById error');
      request(app)
      .get('/api/user/' + user.id)
      .expect(500, done);
    });
    it('should 400 when user not found', function (done) {
      mm.empty(User, 'getById');
      request(app)
      .get('/api/user/' + user.id)
      .expect(400)
      .expect({message: 'user not found'}, done);
    });
    it('should 500 when Feed.getByUser error', function (done) {
      mm.error(Feed, 'getByUser', 'mock Feed.getByUser error');
      request(app)
      .get('/api/user/' + user.id)
      .expect(500, done);
    });
    it('should 200 without offset', function (done) {
      request(app)
      .get('/api/user/' + user.id)
      .expect(200)
      .end(function (err, res) {
        res.body.should.have.keys([
          'id', 'name', 'feeds', 'gmt_create', 'gmt_modified'
        ]);
        res.body.id.should.equal(user.id);
        res.body.name.should.equal(user.name);
        res.body.feeds.length.should.above(0);
        res.body.feeds[0].id.should.be.a.Number;
        res.body.feeds[0].pic.should.be.a.String;
        res.body.feeds[0].content.should.be.a.String;
        res.body.feeds[0].score.should.be.a.Number;
        done(err);
      })
    });
    it('should 200 with offset', function (done) {
      request(app)
      .get('/api/user/' + user.id + '?offset=99999')
      .expect(200)
      .end(function (err, res) {
        res.body.should.have.keys([
          'id', 'name', 'feeds', 'gmt_create', 'gmt_modified'
        ]);
        res.body.id.should.equal(user.id);
        res.body.name.should.equal(user.name);
        res.body.feeds.length.should.equal(0);
        done(err);
      })
    });
  });

  describe('GET /api/me', function () {

    var agent;
    before(function (done) {
      agent = request.agent(app);
      agent.post('/login')
      .send(mock.users[0]).end(done);
    });

    it('should 403 when no login', function (done) {
      request(app)
      .get('/api/me')
      .expect(403, done);
    });
    it('should 500 when User.getById error', function (done) {
      mm.error(User, 'getById', 'mock User.getById error');
      agent
      .get('/api/me')
      .expect(500, done);
    });
    it('should 500 when Feed.getByUser error', function (done) {
      mm.error(Feed, 'getByUser', 'mock Feed.getByUser error');
      agent
      .get('/api/me')
      .expect(500, done);
    });
    it('should 200 without offset', function (done) {
      agent
      .get('/api/me')
      .expect(200)
      .end(function (err, res) {
        res.body.should.have.keys([
          'id', 'name', 'feeds', 'gmt_create', 'gmt_modified'
        ]);
        res.body.id.should.equal(user.id);
        res.body.name.should.equal(user.name);
        res.body.feeds.length.should.above(0);
        res.body.feeds[0].id.should.be.a.Number;
        res.body.feeds[0].pic.should.be.a.String;
        res.body.feeds[0].content.should.be.a.String;
        res.body.feeds[0].score.should.be.a.Number;
        done(err);
      })
    });
    it('should 200 with offset', function (done) {
      agent
      .get('/api/me?offset=99999')
      .expect(200)
      .end(function (err, res) {
        res.body.should.have.keys([
          'id', 'name', 'feeds', 'gmt_create', 'gmt_modified'
        ]);
        res.body.id.should.equal(user.id);
        res.body.name.should.equal(user.name);
        res.body.feeds.length.should.equal(0);
        done(err);
      })
    });
  });
});
