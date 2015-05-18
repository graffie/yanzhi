/**!
 * yanzhi - controllers/feed.js
 */

'use strict';

/**
 * Module dependencies.
 */

var Feed = require('../proxy/feed');

exports.index = function* (next) {
  var params = ['lngmin', 'latmin', 'lngmax', 'latmax'];
  var query = {};
  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    this.query[p] = Number(this.query[p]);
    if (!this.query[p]) {
      this.status = 422;
      return this.body = [];
    }
    query[p] = this.query[p];
  }
  if (query['lngmax'] < query['lngmin'] ||
      query['latmax'] < query['latmin']) {
    this.status = 422;
    return this.body = [];
  }
  this.body = yield Feed.get(query);
};

exports.create = function* (next) {
  this.verifyParams({
    content: 'string',
    userNick: {type: 'string', required: false},
    userInfo: {type: 'string', required: false},
    lng: 'number',
    lat: 'number',
    geoInfo: {type: 'string', required: false},
  });

  var feed = {};
  feed.content = this.request.body.content;
  feed.userNick = this.request.body.userNick || '';
  feed.userInfo = this.request.body.userInfo || '';
  feed.lng = this.request.body.lng;
  feed.lat = this.request.body.lat;
  feed.geoInfo = this.request.body.geoInfo || '';

  var res = yield Feed.add(feed);
  feed.id = res.insertId;
  this.body = feed;
  this.status = 201;
};
