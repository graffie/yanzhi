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
          let signature = this.sign(rstr, stamp, token)
          wx.config({
            debug: false,
            appId: 'wx7fe16cbf82d218e7',
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
    let expire = window.localStorage.getItem('expires_in')
    let token = window.localStorage.getItem('token')
    let stamp = moment().unix()
    if (expire && expire > stamp) {
      return cb(null, token)
    }
    AppAPI.sys().wxtoken().then((res) => {
      if (res.statusCode && res.body) {
        window.localStorage.setItem('token', res.body.access_token)
        window.localStorage.setItem('expires_in', stamp + 6000)
        cb(null, res.body.ticket)
      }
    }, (err) => {
      cb(err)
    })
  }

}
