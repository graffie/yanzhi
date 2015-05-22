var AppDispatcher = require('../dispatchers/AppDispatcher')
var AppConstants = require('../constants/AppConstants')
var EventEmitter = require('events').EventEmitter
var assign = require('object-assign')

var ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'
const CROUTON_EVENT = 'crouton'
const SIGNUP_EVENT = 'signup'
const LOGIN_EVENT = 'login'
const FEEDS_EVENT = 'feeds'
const FEED_EVENT = 'feed'
const USER_EVENT = 'user'

var crouton = null
var feeds = []
var comments = {}
var user = null

function getFeedById(fid) {
  for (let i = feeds.length - 1; i >= 0; i--) {
    let f = feeds[i]
    if (fid == f.id) {
      return f
    }
  }
  return null
}

function getCommentById(fid) {
  return comments[fid]
}

var AppStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT)
  },

  addChangeListener: function (cb) {
    this.on(CHANGE_EVENT, cb)
  },

  removeChangeListener: function (cb) {
    this.removeListener(CHANGE_EVENT, cb)
  },

  emitCrouton: function () {
    this.emit(CROUTON_EVENT)
  },

  addCroutonListener: function (cb) {
    this.on(CROUTON_EVENT, cb)
  },

  removeCroutonListener: function (cb) {
    this.removeListener(CROUTON_EVENT, cb)
  },

  getCrouton: function () {
    return crouton
  },

  emitSignup: function () {
    this.emit(SIGNUP_EVENT)
  },

  addSignupListener: function (cb) {
    this.on(SIGNUP_EVENT, cb)
  },

  removeSignupListener: function (cb) {
    this.removeListener(SIGNUP_EVENT, cb)
  },

  emitLogin: function () {
    this.emit(LOGIN_EVENT)
  },

  addLoginListener: function (cb) {
    this.on(LOGIN_EVENT, cb)
  },

  removeLoginListener: function (cb) {
    this.removeListener(LOGIN_EVENT, cb)
  },

  emitFeeds: function () {
    this.emit(FEEDS_EVENT)
  },

  addFeedsListener: function (cb) {
    this.on(FEEDS_EVENT, cb)
  },

  removeFeedsListener: function (cb) {
    this.removeListener(FEEDS_EVENT, cb)
  },

  getFeeds: function () {
    return feeds
  },

  getFeedById: getFeedById,

  emitFeed: function () {
    this.emit(FEED_EVENT)
  },

  addFeedListener: function (cb) {
    this.on(FEED_EVENT, cb)
  },

  removeFeedListener: function (cb) {
    this.removeListener(FEED_EVENT, cb)
  },

  getCommentById: getCommentById,

  emitUser: function () {
    this.emit(USER_EVENT)
  },

  addUserListener: function (cb) {
    this.on(USER_EVENT, cb)
  },

  removeUserListener: function (cb) {
    this.removeListener(USER_EVENT, cb)
  },

  getUser: function () {
    return user
  }

})

AppStore.dispatchToken = AppDispatcher.register(function (playload) {

  var action = playload.action
  switch (action.type) {
    case ActionTypes.SHOW_CROUTON:
      crouton = action.data
      AppStore.emitCrouton()
      break
    case ActionTypes.USER_SIGNUP_SUCCESS:
      return AppStore.emitSignup()
    case ActionTypes.USER_LOGIN_SUCCESS:
      return AppStore.emitLogin()
    case ActionTypes.GET_FEEDS_SUCCESS:
      feeds = feeds.concat(action.data)
      return AppStore.emitFeeds()
    case ActionTypes.GET_SELF_SUCCESS:
      user = action.data
      return AppStore.emitUser()
    case ActionTypes.GET_FEED_SUCCESS:
      comments[action.id] = action.data
      return AppStore.emitFeed()
  }
})

module.exports = AppStore
