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

  var cachedAccessToken;
  var cachedTicket;
  afterEach(mm.restore);

  describe('GET /sys/weixin/ticket', function () {
    it('should xxx when fetch token error', function (done) {
      mm(weixin, 'API_TOKEN', 'http://httpstat.us/400');
      request(app)
      .get('/sys/weixin/ticket')
      .expect(400, done);
    });
    it('should 500 when fetch token failed', function (done) {
      mm(weixin, 'API_TOKEN', 'https://api.weixin.qq.com/cgi-bin/token?\
                      grant_type=client_credential&\
                      appid=APPID&secret=APPSECRET');
      request(app)
      .get('/sys/weixin/ticket')
      .expect(500, done);
    });
    it('should 500 when fetch ticket failed', function (done) {
      mm(weixin, 'API_TICKET', 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?\
                            access_token=ACCESS_TOKEN&type=jsapi');
      request(app)
      .get('/sys/weixin/ticket')
      .expect(500, done);
    });
    it('should 200 with freshed ticket', function (done) {
      request(app)
      .get('/sys/weixin/ticket')
      .expect(200)
      .end(function (err, res) {
        res.body.should.have.keys(['ticket', 'expires_in', 'gmt_create']);
        res.body.ticket.should.equal(weixin.current.ticket);
        cachedTicket = weixin.current.ticket;
        done(err);
      });
    });
    it('should 200 with cached ticket', function (done) {
      request(app)
      .get('/sys/weixin/ticket')
      .expect(200)
      .end(function (err, res) {
        res.body.ticket.should.equal(cachedTicket);
        cachedAccessToken = weixin._accessToken;
        done(err);
      });
    });
    it('should 200 when ticket expired', function (done) {
      mm(weixin.current, 'expiresIn', null);
      request(app)
      .get('/sys/weixin/ticket')
      .expect(200)
      .end(function (err, res) {
        res.body.ticket.should.equal(cachedTicket);
        weixin._accessToken.should.not.equal(cachedAccessToken);
        done(err);
      });
    });
  });
});
