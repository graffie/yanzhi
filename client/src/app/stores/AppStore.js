var AppDispatcher = require('../dispatchers/AppDispatcher')
var AppConstants = require('../constants/AppConstants')
var EventEmitter = require('events').EventEmitter
var assign = require('object-assign')

var ActionTypes = AppConstants.ActionTypes
var CHANGE_EVENT = 'change'
var CROUTON_EVENT = 'crouton'
var SIGNUP_EVENT = 'signup'
var LOGIN_EVENT = 'login'

var crouton = null

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

  emitCrouton: function() {
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

  emitSignup: function() {
    this.emit(SIGNUP_EVENT)
  },

  addSignupListener: function (cb) {
    this.on(SIGNUP_EVENT, cb)
  },

  removeSignupListener: function (cb) {
    this.removeListener(SIGNUP_EVENT, cb)
  },

  emitLogin: function() {
    this.emit(LOGIN_EVENT)
  },

  addLoginListener: function (cb) {
    this.on(LOGIN_EVENT, cb)
  },

  removeLoginListener: function (cb) {
    this.removeListener(LOGIN_EVENT, cb)
  },
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
    case ActionTypes.ALERT_DEL:
      delAlert(action.idx)
      AppStore.emitChange()
      break
  }
})

module.exports = AppStore
