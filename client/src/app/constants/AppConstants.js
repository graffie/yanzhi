'use strict';

/**
 * Module dependencies.
 */
var keyMirror = require('react/lib/keyMirror');

module.exports = {

  // Action types define actions.
  ActionTypes: keyMirror({

    // App actions.
    GET_SELF_SUCCESS: null,

    USER_LOGIN: null,
    USER_LOGIN_SUCCESS: null,
    USER_LOGIN_FAILED: null,

    GET_USER: null,
    GET_USER_SUCCESS: null,
    GET_USER_FAILED: null,

    USER_SIGNUP: null,
    USER_SIGNUP_SUCCESS: null,
    USER_SIGNUP_FAILED: null,

    GET_FEEDS_SUCCESS: null,
    GET_FEED_SUCCESS: null,

    // Crouton
    SHOW_CROUTON: null
  }),

  PayloadSources: keyMirror({
    // Action from API server.
    SERVER_ACTION: null,
    // Action from views.
    VIEW_ACTION: null
  })
};
