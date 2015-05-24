/**!
 * yanzhi - controllers/sys.js
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../config').weixin;
var urllib = require('co-urllib');
var trans = require('var-style');

exports.current = {};
exports.API = 'https://api.weixin.qq.com/cgi-bin/token?' +
                'grant_type=client_credential&' +
                'appid=' + config.appId + '&' +
                'secret=' + config.appSecret;

function* fetchToken() {
  var result = yield urllib.request(exports.API);
  var status = result.status;
  var resp = result.data.toString();
  var json = JSON.parse(resp);
  if (status !== 200 || !json.access_token) {
    var err = new Error('Fetch weixin access token error');
    err.status = 500;
    err.resp = resp;
    throw err;
  }
  return trans.snakeToCamel(json);
}

exports.token = function* (next) {
  if (exports.current && exports.current.accessToken) {
    var now = new Date();
    var gmtCreate = exports.current.gmtCreate;
    var expiresIn = exports.current.expiresIn || 0;
    if ((now - gmtCreate) < (expiresIn * 1000)) {
      this.status = 200;
      this.body = exports.current;
      return;
    }
  }
  var result = yield fetchToken();
  result.gmtCreate = new Date();
  exports.current = result;
  this.status = 200;
  this.body = exports.current;
};
