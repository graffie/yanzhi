/**!
 * yanzhi - controllers/weixin.js
 */

'use strict';

/**
 * Module dependencies.
 */
var config = require('../config').weixin;
var urllib = require('co-urllib');
var trans = require('var-style');

exports.current = {};
exports._accessToken;

exports.API_TOKEN = 'https://api.weixin.qq.com/cgi-bin/token?' +
                      'grant_type=client_credential&' +
                      'appid=' + config.appId + '&' +
                      'secret=' + config.appSecret;

exports.API_TICKET = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?' +
                        'access_token={{ACCESS_TOKEN}}&type=jsapi';

function* _request(url, field) {
  var result = yield urllib.request(url);
  var status = result.status;
  var resp = result.data.toString();
  if (status !== 200) {
    var err = new Error('Request weixin API error');
    err.status = status;
    err.resp = resp;
    throw err;
  }
  var json = JSON.parse(resp);
  if (!json[field]) {
    var err = new Error('Request weixin API failed');
    err.status = 500;
    err.resp = resp;
    throw err;
  }
  return trans.snakeToCamel(json);
}

function* fetchTicket() {
  var accessTokenResp = yield _request(exports.API_TOKEN, 'access_token');
  exports._accessToken = accessTokenResp.accessToken;

  var url = exports.API_TICKET.replace('{{ACCESS_TOKEN}}', exports._accessToken);
  var ticketResp = yield _request(url, 'ticket');
  exports.current = {
    ticket: ticketResp.ticket,
    expiresIn: ticketResp.expiresIn,
    gmtCreate: new Date(),
  };
}

exports.ticket = function* (next) {
  if (exports.current.ticket) {
    var now = new Date();
    var gmtCreate = exports.current.gmtCreate;
    var expiresIn = exports.current.expiresIn || 0;
    if ((now - gmtCreate) <= (expiresIn * 1000)) {
      this.status = 200;
      this.body = exports.current;
      return;
    }
  }
  yield fetchTicket();
  this.status = 200;
  this.body = exports.current;
};
