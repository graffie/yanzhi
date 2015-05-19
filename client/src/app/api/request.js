/**!
 * birdman - client/src/app/api/request.js
 */

'use strict';

/**
 * Module dependencies.
 */
var xhr = require('xhr');
var Promise = require('es6-promise').Promise;

module.exports = {

  _request: function (method, uri, body, headers) {
    return new Promise(function (resolve, reject) {
      headers = headers || {};
      headers['Content-Type'] = 'application/json';
      xhr({
        method: method,
        json: body || {},
        uri: uri,
        timeout: 10 * 1000,
        headers: headers
      }, function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  },

  get: function (uri) {
    return this._request('GET', uri);
  },

  post: function (uri, body) {
    return this._request('POST', uri, body);
  },

  put: function (uri, body) {
    return this._request('PUT', uri, body);
  },

  patch: function (uri, body) {
    return this._request('PATCH', uri, body);
  },

  delete: function (uri) {
    return this._request('DELETE', uri);
  },
};
