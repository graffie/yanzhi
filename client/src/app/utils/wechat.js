import crypto from 'crypto'
import moment from 'moment'

// weixin
import AppAPI from '../api/AppAPI'

export default class Wechat {

  constructor() {

  }

  config() {

    if (typeof window != undefined && window.wx) {
      let rstr = crypto.randomBytes(8).toString('hex')
      let stamp = moment().unix()
      this.getToken((err, token) => {
        if (token) {
          let signature = this.sign(rstr, stamp, token)
          wx.config({
            // debug: true,
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
    let url = window.location.origin
    let str = `jsapi_ticket=${token}&noncestr=${rstr}&timestamp=${stamp}&url=${url}`
    console.log(str)
    return crypto.createHash('sha1').update(str).digest('hex')
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
