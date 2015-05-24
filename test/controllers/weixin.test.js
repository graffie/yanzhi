/**!
 * yanzhi - test/controllers/weixin.test.js
 */

'use strict';

/**
 * Module dependencies.
 */
var weixin = require('../../controllers/weixin');
var request = require('supertest');
var app = require('../../app');
var should = require('should');
var mock = require('../mock');
var mm = require('mm');

describe('controllers/weixin.test.js', function () {

  var cachedToken;
  afterEach(mm.restore);

  describe('GET /sys/weixin/token', function () {
    it('should 500 when fetch token error', function (done) {
      var _API = weixin.API;
      weixin.API = 'https://api.weixin.qq.com/cgi-bin/token?\
                      grant_type=client_credential&\
                      appid=APPID&secret=APPSECRET';
      request(app)
      .get('/sys/weixin/token')
      .expect(500)
      .end(function (err, res) {
        weixin.API = _API;
        done(err);
      });
    });
    it('should 200 with freshed token', function (done) {
      request(app)
      .get('/sys/weixin/token')
      .expect(200)
      .end(function (err, res) {
        res.body.should.have.keys(['access_token', 'expires_in', 'gmt_create']);
        res.body.access_token.should.equal(weixin.current.accessToken);
        cachedToken = weixin.current.accessToken;
        done(err);
      });
    });
    it('should 200 with cached token', function (done) {
      request(app)
      .get('/sys/weixin/token')
      .expect(200)
      .end(function (err, res) {
        res.body.access_token.should.equal(cachedToken);
        done(err);
      });
    });
    it('should 200 when token expired', function (done) {
      mm(weixin.current, 'expiresIn', null);
      request(app)
      .get('/sys/weixin/token')
      .expect(200)
      .end(function (err, res) {
        res.body.access_token.should.not.equal(cachedToken);
        done(err);
      });
    });
  });
});
