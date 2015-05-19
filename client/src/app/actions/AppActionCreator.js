var assign = require('react/lib/Object.assign');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var ActionTypes = AppConstants.ActionTypes;

var AppActionCreator = {

  modalBackdropActive: function () {
    AppDispatcher.handleViewAction({
      type: ActionTypes.MODAL_BACKDROP_ACTIVE
    });
  },

  modalBackdropDeactive: function () {
    AppDispatcher.handleViewAction({
      type: ActionTypes.MODAL_BACKDROP_DEACTIVE
    });
  },

  alertAdd: function (data) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.ALERT_ADD,
      data: data
    });
  },

  alertDel: function (idx) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.ALERT_DEL,
      idx: idx
    });
  },
};

module.exports = AppActionCreator;
