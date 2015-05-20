var assign = require('react/lib/Object.assign')
var AppConstants = require('../constants/AppConstants')
var AppDispatcher = require('../dispatchers/AppDispatcher')
var AppAPI = require('../api/AppAPI')
var ActionTypes = AppConstants.ActionTypes

var Crouton = {
  showInfo: function (data) {
    if (typeof data === 'string') {
      data = {
        message: data,
        type: 'info'
      }
    }
    this.setCrouton(data);
  },

  show: function (data) {
    if (typeof data === 'string') {
      data = {
        message: data
      }
    }
    data.type = data.type || 'error'
    AppDispatcher.handleViewAction({
      type: ActionTypes.SHOW_CROUTON,
      data: data
    });
  }
}

var AppActionCreator = {

  login: function (data) {
    AppAPI.user().login(data).then(function (res) {
      if (res.body && res.body.status != 200) {
        return Crouton.show("用户名或密码错误")
      }
      AppDispatcher.handleServerAction({
        type: ActionTypes.USER_LOGIN_SUCCESS,
        data: res
      })
    }).catch((err) => {
      Crouton.show(err.msg)
    })
  },

  signup: function (data) {
    AppAPI.user().signup(data).then(function (res) {
      if (res.body && res.body.status != 200) {
        return Crouton.show({
          message: '注册失败',
          buttons: [{
            name: '重试',
            listener: AppActionCreator.signup.bind(this, data)
          }, {
            name: '忽略'
          }]
        })
      }
      AppDispatcher.handleServerAction({
        type: ActionTypes.USER_SIGNUP_SUCCESS,
        data: res.body
      })
    }).catch((err) => {
      Crouton.show(err.msg)
    })
  }

}

module.exports = AppActionCreator
