'use strict'

/**
 * Module dependencies.
 */
var request = require('./request')


var api = {}

api['user'] = function (uid) {
  return {
    get: function () {
      return request.get(`/api/user/${uid}`)
    },

    signup: function (data) {
      return request.post('/join', data)
    },

    login: function (data) {
      return request.post('/login', data)
    }
  }
}

api['feed'] = function (fid) {
  return {
    explore: request.get('/api/feed'),

    get: request(`/api/feed/${fid}`),

    create: '',

    vote: function (data) {
      return request.post(`/api/feed/${fid}/vote`, data)
    },

    comment: {
      create: function (data) {
        request(`/api/feed/${fid}/comment`, data)
      }
    }
  }
}

module.exports = api
