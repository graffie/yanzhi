'use strict'

/**
 * Module dependencies.
 */
var request = require('./request')


var api = {}

api['user'] = function (uid) {
  return {
    me: function() {
      return request.get('/api/me')
    },
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
    explore: function() {
      return request.get('/api/feed')
    },

    get: function() {
      return request.get(`/api/feed/${fid}`)
    },

    create: function(data) {
      return request.post('/api/feed', data)
    },

    vote: function (data) {
      return request.post(`/api/feed/${fid}/vote`, data)
    },

    comment: {
      create: function (data) {
        return request.get(`/api/feed/${fid}/comment`, data)
      }
    }
  }
}

module.exports = api
