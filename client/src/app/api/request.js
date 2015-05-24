/**!
 * birdman - client/src/app/api/request.js
 */

'use strict';

/**
 * Module dependencies.
 */
var xhr = require('xhr');

export default {

  _xhr: xhr,

  _request(method, uri, body, headers) {
    return new Promise(function (resolve, reject) {
      headers = headers || {};
      headers['Content-Type'] = 'application/json';
      xhr({
        method: method,
        json: body || {},
        uri: uri,
        timeout: 100 * 1000,
        headers: headers
      }, function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res);
      });
    });
  },

  get(uri) {
    return this._request('GET', uri);
  },

  post(uri, body, headers) {
    return this._request('POST', uri, body, headers);
  },

  put(uri, body) {
    return this._request('PUT', uri, body);
  },

  patch(uri, body) {
    return this._request('PATCH', uri, body);
  },

  delete(uri) {
    return this._request('DELETE', uri);
  },
};
