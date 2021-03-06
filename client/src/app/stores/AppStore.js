var AppDispatcher = require('../dispatchers/AppDispatcher')
var AppConstants = require('../constants/AppConstants')
var EventEmitter = require('events').EventEmitter
var assign = require('object-assign')

var ActionTypes = AppConstants.ActionTypes
const CHANGE_EVENT = 'change'
const CROUTON_EVENT = 'crouton'
const SIGNUP_EVENT = 'signup'
const LOGIN_EVENT = 'login'
const LOGOUT_EVENT = 'logout'
const FEEDS_EVENT = 'feeds'
const FEED_EVENT = 'feed'
const SELF_EVENT = 'selt'
const USER_EVENT = 'user'
const CREATE_EVENT = 'create'
const REMOVE_EVENT = 'remove'
const CREATE_COMMENT_EVENT = 'createcomment'
const VOTE_EVENT = 'vote'

var crouton = null
var feeds = []
var comments = {}
var selfobj = null
var user = {}
var createResult = false

function logout() {
  selfobj = null
}

function getFeedById(fid) {
  for (let i = feeds.length - 1; i >= 0; i--) {
    let f = feeds[i]
    if (fid == f.id) {
      return f
    }
  }
  let c = comments[fid]
  return c ? c.feed : null
}

function getCommentById(fid) {
  let c = comments[fid]
  return c ? c.comments : null
}

function replaceFeed(feed) {
  if (feed && feed.id) {
    feeds = feeds.map((f) => {
      return f.id == feed.id ? feed : f
    })
  }
}

function createFeed(data) {
  feeds.unshift(data)
  if (selfobj && selfobj.feeds) {
    selfobj.feeds.unshift(data)
  }
}

function removeFeed(fid) {
  feeds = feeds.filter((f) => {
    return f.id != fid
  })
  delete comments[fid]
  selfobj.feeds = selfobj.feeds.filter((f) => {
    return f.id != fid
  })
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

  emitLogout: function () {
    this.emit(LOGOUT_EVENT)
  },

  addLogoutListener: function (cb) {
    this.on(LOGOUT_EVENT, cb)
  },

  removeLogoutListener: function (cb) {
    this.removeListener(LOGOUT_EVENT, cb)
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

  emitSelf: function () {
    this.emit(SELF_EVENT)
  },

  addSelfListener: function (cb) {
    this.on(SELF_EVENT, cb)
  },

  removeSelfListener: function (cb) {
    this.removeListener(SELF_EVENT, cb)
  },

  getSelf: function () {
    return selfobj
  },

  emitUser: function () {
    this.emit(USER_EVENT)
  },

  addUserListener: function (cb) {
    this.on(USER_EVENT, cb)
  },

  removeUserListener: function (cb) {
    this.removeListener(USER_EVENT, cb)
  },

  getUser: function (uid) {
    return user[uid]
  },

  emitCreate: function () {
    this.emit(CREATE_EVENT)
  },

  addCreateListener: function (cb) {
    this.on(CREATE_EVENT, cb)
  },

  removeCreateListener: function (cb) {
    this.removeListener(CREATE_EVENT, cb)
  },

  emitCreateComment: function () {
    this.emit(CREATE_COMMENT_EVENT)
  },

  addCreateCommentListener: function (cb) {
    this.on(CREATE_COMMENT_EVENT, cb)
  },

  removeCreateCommentListener: function (cb) {
    this.removeListener(CREATE_COMMENT_EVENT, cb)
  },

  getCreateResult: function () {
    return createResult
  },

  emitVote: function () {
    this.emit(VOTE_EVENT)
  },

  addVoteListener: function (cb) {
    this.on(VOTE_EVENT, cb)
  },

  removeVoteListener: function (cb) {
    this.removeListener(VOTE_EVENT, cb)
  },

  emitRemoveFeed: function () {
    this.emit(REMOVE_EVENT)
  },

  addRemoveFeedListener: function (cb) {
    this.on(REMOVE_EVENT, cb)
  },

  removeRemoveFeedListener: function (cb) {
    this.removeListener(REMOVE_EVENT, cb)
  },

})

AppStore.dispatchToken = AppDispatcher.register(function (playload) {

  var action = playload.action
  switch (action.type) {
    case ActionTypes.SHOW_CROUTON:
      crouton = action.data
      return AppStore.emitCrouton()
    case ActionTypes.USER_SIGNUP_SUCCESS:
    case ActionTypes.USER_SIGNUP_FAILED:
      return AppStore.emitSignup()
    case ActionTypes.USER_LOGIN_SUCCESS:
    case ActionTypes.USER_LOGIN_FAILED:
      return AppStore.emitLogin()
    case ActionTypes.USER_LOGOUT_SUCCESS:
    // case ActionTypes.USER_LOGOUT_FAILED:
      logout()
      return AppStore.emitLogout()
    case ActionTypes.GET_FEEDS_SUCCESS:
      feeds = feeds.concat(action.data)
      return AppStore.emitFeeds()
    case ActionTypes.GET_SELF_SUCCESS:
      selfobj = action.data
      return AppStore.emitSelf()
    case ActionTypes.GET_FEED_SUCCESS:
      comments[action.id] = action.data
      return AppStore.emitFeed()
    case ActionTypes.GET_USER_SUCCESS:
      user[action.uid] = action.data
      return AppStore.emitUser()
    case ActionTypes.CREATE_FEED:
      createResult = false
      return
    case ActionTypes.CREATE_FEED_SUCCESS:
      createFeed(action.data)
      createResult = true
    case ActionTypes.CREATE_FEED_FAILED:
      return AppStore.emitCreate()
    case ActionTypes.REMOVE_FEED_SUCCESS:
      removeFeed(action.id)
      AppStore.emitFeeds()
    case ActionTypes.REMOVE_FEED_FAILED:
      return AppStore.emitRemoveFeed()
    case ActionTypes.CREATE_COMMENT_FAILED:
    case ActionTypes.CREATE_COMMENT_SUCCESS:
      return AppStore.emitCreateComment()
    case ActionTypes.VOTE_FEED_SUCCESS:
      replaceFeed(action.data)
      AppStore.emitFeeds()
    case ActionTypes.VOTE_FEED_FAILED:
      return AppStore.emitVote()
  }
})

module.exports = AppStore
