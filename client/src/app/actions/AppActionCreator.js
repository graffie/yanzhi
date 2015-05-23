var assign = require('react/lib/Object.assign')

var AppConstants = require('../constants/AppConstants')
var AppDispatcher = require('../dispatchers/AppDispatcher')
var AppAPI = require('../api/AppAPI')
var ActionTypes = AppConstants.ActionTypes
var lang = require('../constants/lang')
lang = lang[process.env.LANG || 'zh-cn']

var Crouton = {
  showInfo(data) {
    if (typeof data === 'string') {
      data = {
        message: data,
        type: 'info'
      }
    }
    this.show(data);
  },

  show(data) {
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

  me() {
    return AppAPI.user().me().then(function (res) {
      if (res.statusCode == 200 && res.body) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.GET_SELF_SUCCESS,
          data: res.body
        })
      }
      return {}
    })
  },

  login(data) {
    AppAPI.user().login(data).then(function (res) {
      if (res.body && res.body.status != 200) {
        return Crouton.show(lang.user.login_failed)
      }
      AppDispatcher.handleServerAction({
        type: ActionTypes.USER_LOGIN_SUCCESS,
        data: res
      })
    }).catch((err) => {
      Crouton.show(err.message)
    })
  },

  signup(data) {
    AppAPI.user().signup(data).then(function (res) {
      if (res.body && res.body.status != 200) {
        return Crouton.show({
          message: lang.user.signup_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.signup.bind(null, data)
          }, {
            name: lang.button.ignore
          }]
        })
      }
      AppActionCreator.me().then(() => {
        AppDispatcher.handleServerAction({
          type: ActionTypes.USER_SIGNUP_SUCCESS,
          data: res.body
        })
      }).catch((err) => {
        Crouton.show({
          message: lang.user.get_self_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.me
          }, {
            name: lang.button.ignore
          }]
        })
      })
    }).catch((err) => {
      Crouton.show(err.message)
    })
  },

  getUser(uid) {
    AppAPI.user(uid).get().then(function(res) {
      if (res.statusCode != 200 || !res.body) {
        return Crouton.show({
          message: lang.feed.get_user_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.getUser.bind(null, uid)
          }, {
            name: lang.button.ignore
          }]
        })
      }
      AppDispatcher.handleServerAction({
        type: ActionTypes.GET_USER_SUCCESS,
        uid: uid,
        data: res.body
      })
    }).catch((err) => {
      Crouton.show(err.message)
    })
  },

  getFeeds() {
    AppAPI.feed().explore().then(function (res) {
      if (res.statusCode != 200 || !res.body) {
        return Crouton.show({
          message: lang.feed.list_feed_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.getFeeds
          }, {
            name: lang.button.ignore
          }]
        })
      }
      AppDispatcher.handleServerAction({
        type: ActionTypes.GET_FEEDS_SUCCESS,
        data: res.body
      })
    }).catch((err) => {
      Crouton.show(err.message)
    })
  },

  getFeed(fid) {
    AppAPI.feed(fid).get().then(function (res) {
      if (res.statusCode != 200 || !res.body) {
        Crouton.show({
          message: lang.feed.get_feed_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.getFeed.bind(null, fid)
          }, {
            name: lang.button.ignore
          }]
        })
      } else {
        AppDispatcher.handleServerAction({
          type: ActionTypes.GET_FEED_SUCCESS,
          data: res.body,
          id: fid
        })
      }
      return {}
    }, (err) => {
      console.log(err)
      Crouton.show(err.message)
    }).catch((err) => {
      console.log(err)
      Crouton.show(err.message)
    })
  },

  uploadPhoto(data) {
    AppAPI.feed().create(data).then(function (res) {
      if (res.statusCode != 200 || !res.body) {
        return Crouton.show({
          message: lang.feed.upload_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.uploadPhoto.bind(null, data)
          }, {
            name: lang.button.ignore
          }]
        })
      }
    }).catch((err) => {
      Crouton.show(err.message)
    })
  }

}

AppActionCreator.Crouton = Crouton

module.exports = AppActionCreator
