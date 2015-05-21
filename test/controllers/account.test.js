/**!
 * yanzhi - test/controllers/account.test.js
 */

'use strict';

/**
 * Module dependencies.
 */

var User = require('../../proxy/user');
var request = require('supertest');
var app = require('../../app');
var should = require('should');
var mock = require('../mock');
var mm = require('mm');

var user = mock.users[0];

describe('controllers/account.test.js', function () {

  afterEach(mm.restore);

  describe('POST /login', function () {
    it('should 400 when without name', function (done) {
      request(app)
      .post('/login')
      .send({password: '1234'})
      .expect(200)
      .expect({
        status: 400,
        message: 'parameter missed'
      }, done);
    });
    it('should 400 when without password', function (done) {
      request(app)
      .post('/login')
      .send({name: '123'})
      .expect(200)
      .expect({
        status: 400,
        message: 'parameter missed'
      }, done);
    });
    it('should 400 when authorization failed', function (done) {
      request(app)
      .post('/login')
      .send({name: '123', password: '1234'})
      .expect(200)
      .expect({
        status: 400,
        message: 'authorization failed'
      }, done);
    });
    it('should 500 when User.auth error', function (done) {
      mm.error(User, 'auth', 'mock User.auth error');
      request(app)
      .post('/login')
      .send({name: '123', password: '1234'})
      .expect(500, done);
    });
    it('should 200 without redirect', function (done) {
      request(app)
      .post('/login')
      .send({
        name: user.name,
        password: user.password,
      })
      .expect(200)
      .end(function (err, res) {
        res.body.status.should.equal(200);
        res.body.redirect.should.equal('/');
        res.body.user.id.should.above(0);
        res.body.user.name.should.equal(user.name);
        should.not.exist(res.body.user.password);
        should.not.exist(res.body.user.mobile);
        done(err);
      });
    });
    it('should 200 with invalid redirect', function (done) {
      request(app)
      .post('/login')
      .send({
        name: user.name,
        password: user.password,
        redirect: 'http://www.taobao.com/hehe'
      })
      .expect(200)
      .end(function (err, res) {
        res.body.status.should.equal(200);
        res.body.redirect.should.equal('/');
        res.body.user.id.should.above(0);
        res.body.user.name.should.equal(user.name);
        should.not.exist(res.body.user.password);
        should.not.exist(res.body.user.mobile);
        done(err);
      });
    });
    it('should 200 with redirect', function (done) {
      request(app)
      .post('/login')
      .send({
        name: user.name,
        password: user.password,
        redirect: '/user/123'
      })
      .expect(200)
      .end(function (err, res) {
        res.body.status.should.equal(200);
        res.body.redirect.should.equal('/user/123');
        res.body.user.id.should.above(0);
        res.body.user.name.should.equal(user.name);
        should.not.exist(res.body.user.password);
        should.not.exist(res.body.user.mobile);
        done(err);
      });
    });
  });

  describe('POST /logout', function () {
    it('should work', function (done) {
      request(app)
      .post('/logout')
      .expect(302)
      .expect('location', '/', done);
    });
  });

  describe('POST /join', function () {
    it('should 400 when already login', function (done) {
      var agent = request.agent(app);
      agent
      .post('/login')
      .send(user)
      .expect(200)
      .end(function (err) {
        should.not.exists(err);
        agent.post('/join')
        .expect({status: 400, message: 'already login'}, done);
      });
    });
    it('should 400 when duplicate user', function (done) {
      request(app)
      .post('/join')
      .send(user)
      .expect({status: 400, message: 'duplicate error'}, done);
    });
    it('should 500 when User.add user', function (done) {
      mm.error(User, 'add', 'mock User.add error');
      request(app)
      .post('/join')
      .send({
        name: 'unittest' + Date.now(),
        password: '123',
      })
      .expect(500, done);
    });
    it('should 500 when User.getByName user', function (done) {
      mm.error(User, 'getByName', 'mock User.getByName error');
      request(app)
      .post('/join')
      .send({
        name: 'unittest' + Date.now(),
        password: '123',
      })
      .expect(500, done);
    });
    it('should 200', function (done) {
      request(app)
      .post('/join')
      .send({
        name: 'unittest' + Date.now(),
        password: '123',
      })
      .expect(200)
      .expect({status: 200}, done);
    });
  });
});
