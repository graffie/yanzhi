var assign = require('react/lib/Object.assign');
var AppConstants = require('../constants/AppConstants');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var AppAPI = require('../api/AppApi');
var ActionTypes = AppConstants.ActionTypes;
var lang = require('../constants/lang');
lang = typeof lang[process.env.LANG] === 'object' ?
        lang[process.env.LANG] : lang['zh-cn'];

var Crouton = {
  showInfo(data) {
    if (typeof data === 'string') {
      data = {
        message: data,
        type: 'info'
      };
    }
    this.show(data);
  },

  show(data) {
    if (typeof data === 'string') {
      data = {
        message: data
      };
    }
    data.type = data.type || 'error';
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
        });
      }
      return {};
    });
  },

  login(data) {
    AppAPI.user().login(data).then(function (res) {
      if (res.body && res.body.status != 200) {
        return Crouton.show(lang.user.login_failed);
      }
      AppActionCreator.me().then(() => {
        AppDispatcher.handleServerAction({
          type: ActionTypes.USER_LOGIN_SUCCESS,
          data: res.body
        });
      });
    }).catch((err) => {
      Crouton.show(err.message);
      AppDispatcher.handleServerAction({
        type: ActionTypes.USER_LOGIN_FAILED
      });
    });
  },

  logout() {
    AppAPI.user().logout().then(function (res) {
      if (res.statusCode != 200) {
        return Crouton.show({
          message: lang.user.logout_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.logout
          }, {
            name: lang.button.ignore
          }]
        })
      }
      AppDispatcher.handleServerAction({
        type: ActionTypes.USER_LOGOUT_SUCCESS
      })
    }).catch((err) => {
      AppDispatcher.handleServerAction({
        type: ActionTypes.USER_LOGOUT_FAILED
      });
    });
  },

  signup(data) {
    AppAPI.user().signup(data).then(function (res) {
      if (res.body && res.body.status != 200) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.USER_SIGNUP_FAILED
        });
        let msg = lang.user.signup_failed;
        if (res.body.message == 'duplicate error')  {
          msg = lang.user.signup_duplicate_failed;
        }
        return Crouton.show({
          message: msg,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.signup.bind(null, data)
          }, {
            name: lang.button.ignore
          }]
        });
      }
      AppActionCreator.me().then(() => {
        Crouton.showInfo(lang.user.signup_success);
        AppDispatcher.handleServerAction({
          type: ActionTypes.USER_SIGNUP_SUCCESS
        });
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
      AppDispatcher.handleServerAction({
          type: ActionTypes.USER_SIGNUP_FAILED
      })
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
    return AppAPI.feed(fid).get().then(function (res) {
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
        });
      } else {
        AppDispatcher.handleServerAction({
          type: ActionTypes.GET_FEED_SUCCESS,
          data: res.body,
          id: fid
        });
      }
      return {};
    }, (err) => {
      Crouton.show(err.message);
      return err
    }).catch((err) => {
      Crouton.show(err.message);
    })
  },

  createFeed(data) {
    AppDispatcher.handleViewAction({
      type: ActionTypes.CREATE_FEED
    });
    AppAPI.feed().create(data).then(function (res) {
      if (res.statusCode != 201 || !res.body) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.CREATE_FEED_FAILED
        })
        return Crouton.show({
          message: lang.feed.upload_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.createFeed.bind(null, data)
          }, {
            name: lang.button.ignore
          }]
        })
      }else {
        Crouton.showInfo(lang.feed.upload_success)
        AppDispatcher.handleServerAction({
          type: ActionTypes.CREATE_FEED_SUCCESS,
          data: res.body
        })
      }
    }).catch((err) => {
      Crouton.show(err.message)
      AppDispatcher.handleServerAction({
          type: ActionTypes.CREATE_FEED_FAILED
      })
    })
  },

  removeFeed(fid) {
    AppAPI.feed(fid).remove().then(function (res) {
      if (res.statusCode != 200 || !res.body) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.REMOVE_FEED_FAILED
        })
        Crouton.show({
          message: lang.feed.create_feed_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.removeFeed.bind(null, fid)
          }, {
            name: lang.button.ignore
          }]
        })
      }else {
        Crouton.showInfo(lang.feed.create_feed_success)
        AppDispatcher.handleServerAction({
          type: ActionTypes.REMOVE_FEED_SUCCESS,
          id: fid
        })
      }
    }).catch((err) => {
      Crouton.show(err.message)
      AppDispatcher.handleServerAction({
          type: ActionTypes.REMOVE_FEED_FAILED
      })
    })
  },

  voteFeed(fid, data) {
    AppAPI.feed(fid).vote(data).then(function (res) {
      if (res.statusCode != 200 || !res.body) {
        AppDispatcher.handleServerAction({
          type: ActionTypes.VOTE_FEED_FAILED
        })
        return Crouton.show({
          message: lang.feed.vote_feed_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.voteFeed.bind(null, fid, data)
          }, {
            name: lang.button.ignore
          }]
        })
      } else {
        Crouton.showInfo(lang.feed.vote_feed_success);
        AppDispatcher.handleServerAction({
          type: ActionTypes.VOTE_FEED_SUCCESS,
          data: res.body
        });
      }
    }).catch((err) => {
      Crouton.show(err.message);
      AppDispatcher.handleServerAction({
        type: ActionTypes.VOTE_FEED_FAILED
      });
    });
  },

  createComment(fid, data) {
    AppAPI.feed(fid).comment.create(data).then(function(res) {
      if (res.statusCode != 201 || !res.body) {
        Crouton.show({
          message: lang.feed.create_comment_failed,
          autoMiss: false,
          buttons: [{
            name: lang.button.retry,
            listener: AppActionCreator.createComment.bind(null, fid, data)
          }, {
            name: lang.button.ignore
          }]
        })
        AppDispatcher.handleServerAction({
          type: ActionTypes.CREATE_COMMENT_FAILED
        })
      } else {
        AppActionCreator.getFeed(fid).then(() => {
          Crouton.showInfo(lang.feed.create_comment_success)
          AppDispatcher.handleServerAction({
            type: ActionTypes.CREATE_COMMENT_SUCCESS
          })
        })
      }
    }).catch((err) => {
      Crouton.show(err.message)
      AppDispatcher.handleServerAction({
          type: ActionTypes.CREATE_COMMENT_FAILED
      })
    })
  }

}

AppActionCreator.Crouton = Crouton

module.exports = AppActionCreator
