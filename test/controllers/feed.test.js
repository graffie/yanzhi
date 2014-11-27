/**!
 * 5kw2 - test/controllers/feed.test.js
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
    // it('should 500 when Feed.get error', function (done) {
    // });
    // it('should 200 when succeed', function (done) {
    // });
  });
  describe('POST /api/feed', function () {
    // it('should 500 when Feed.add error', function (done) {
    // });
    // it('should 201 when succeed', function (done) {
    // });
  });
});
