/**!
 * yanzhi - test/controllers/feed.test.js
 */

'use strict';

/**
 * Module dependencies.
 */

var Feed = require('../../proxy/feed');
var app = require('../../app');
var request = require('supertest');
var mm = require('mm');

var agent;

describe('controllers/feed.test.js', function () {
  beforeEach(function () {
    agent = request.agent(app);
  });

  afterEach(function () {
    mm.restore();
  });
  describe('GET /api/feed', function () {
    var QUERY = '?lngmin=120.106671&lngmax=120.112421&latmin=30.281781&latmax=30.288';
    it('should 500 when Feed.get error', function (done) {
      mm.error(Feed, 'get', 'mock Feed.get error');
      agent
      .get('/api/feed' + QUERY)
      .expect(500, done);
    });
    it('should 200 when succeed', function (done) {
      mm.data(Feed, 'get', [{id: 1}, {id: 2}]);
      agent
      .get('/api/feed' + QUERY)
      .expect(200)
      .end(function (err, res) {
        res.body.length.should.equal(2);
        done(err);
      });
    });
  });
  describe('POST /api/feed', function () {
    var MOCK_FEED = {
      content: 'mock feed',
      lng: 12.346,
      lat: 78.901,
      user_nick: 'unittest'
    };
    it('should 500 when Feed.add error', function (done) {
      mm.error(Feed, 'add', 'mock Feed.add error');
      agent
      .post('/api/feed')
      .send(MOCK_FEED)
      .expect(500, done);
    });
    it('should 201 when succeed', function (done) {
      mm.data(Feed, 'add', {insertId: 1});
      agent
      .post('/api/feed')
      .send(MOCK_FEED)
      .expect(201)
      .end(function (err, res) {
        res.body.user_nick.should.equal(MOCK_FEED.user_nick);
        res.body.content.should.equal(MOCK_FEED.content);
        res.body.lng.should.equal(MOCK_FEED.lng);
        res.body.lat.should.equal(MOCK_FEED.lat);
        res.body.id.should.equal(1);
        done(err);
      });
    });
  });
});
