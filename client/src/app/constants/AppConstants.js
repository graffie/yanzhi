'use strict';

/**
 * Module dependencies.
 */
var keyMirror = require('react/lib/keyMirror');

module.exports = {

  // Action types define actions.
  ActionTypes: keyMirror({

    // App actions.

  }),

  PayloadSources: keyMirror({
    // Action from API server.
    SERVER_ACTION: null,
    // Action from views.
    VIEW_ACTION: null
  })
};
