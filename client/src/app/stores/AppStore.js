var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = AppConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var current = {
  modalBackdropActive: false,
  alerts: []
};

function addAlert(data) {
  current.alerts.push(data);
}

function delAlert(idx) {
  current.alerts.splice(idx, 1);
}

var AppStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener: function (cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },

  get: function () {
    return current;
  }
});

AppStore.dispatchToken = AppDispatcher.register(function (playload) {

  var action = playload.action;
  switch (action.type) {
    case ActionTypes.MODAL_BACKDROP_ACTIVE:
      current.modalBackdropActive = true;
      AppStore.emitChange();
      break;
    case ActionTypes.MODAL_BACKDROP_DEACTIVE:
      current.modalBackdropActive = false;
      AppStore.emitChange();
      break;
    case ActionTypes.ALERT_ADD:
      addAlert(action.data);
      AppStore.emitChange();
      break;
    case ActionTypes.ALERT_DEL:
      delAlert(action.idx);
      AppStore.emitChange();
      break;
  }
});

module.exports = AppStore;
