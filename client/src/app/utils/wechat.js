import rusha from 'rusha'
import randomString from 'random-string'
import moment from 'moment'

// weixin
import AppAPI from '../api/AppAPI'

export default class Wechat {

  constructor() {

  }

  config() {

    if (typeof window != undefined && window.wx) {
      let rstr = randomString({
        length: 16,
        numeric: true,
        letters: true,
        special: false
      })
      let stamp = moment().unix()
      this.getToken((err, token) => {
        if (token) {
          let signature = this.sign(rstr, stamp, token.ticket)
          wx.config({
            debug: true,
            appId: token.app_id,
            timestamp: stamp,
            nonceStr: rstr,
            signature: signature,
            jsApiList: [
              'checkJsApi',
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'onMenuShareQQ',
              'onMenuShareWeibo'
            ]
          })
        }
      })
    }
  }

  sign(rstr, stamp, token) {
    let url = window.location.href.split('#')[0]
    let str = `jsapi_ticket=${token}&noncestr=${rstr}&timestamp=${stamp}&url=${url}`
    return (new rusha()).digestFromString(str)
  }

  getToken(cb) {
    let token = window.localStorage.getItem('token')
    try {
      token = JSON.parse(token)
    } catch(err) {
      return cb(err)
    }
    let stamp = moment().unix()
    if (token && token.expires_in > stamp) {
      return cb(null, token)
    }
    AppAPI.sys().wxtoken().then((res) => {
      if (res.statusCode == 200 && res.body) {
        let obj = res.body
        obj.expires_in = stamp + 6000
        try {
          let str = JSON.stringify(obj)
          window.localStorage.setItem('token', str)
        }catch(err) {
          cb(err)
        }
      }
    }, (err) => {
      cb(err)
    })
  }

}
