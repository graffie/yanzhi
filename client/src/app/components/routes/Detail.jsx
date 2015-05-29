import React from 'react'
import { Navigation, State, Link } from 'react-router'
import moment from 'moment'

import Modal from '../views/Modal'
import Comment from '../views/Comment'
import BottomMenu from '../views/BottomMenu'
import Store from '../../stores/AppStore'
import bio from '../../utils/bio'
import {Crouton, getFeed, createComment, voteFeed, removeFeed} from '../../actions/AppActionCreator'

import '../../utils/zh-cn'

let Detail  = React.createClass({

  statics: {
    willTransitionTo: function (transition, params, query, cb) {
      let c = Store.getCommentById(params.id)
      if (!c) {
        getFeed(params.id)
      }
      cb()
    }
  },

  propTypes: {
    // id: React.PropTypes.number,
    // url: React.PropTypes.string,
    // score: React.PropTypes.number
  },

  getDefaultProps() {
    return {
    }
  },

  getInitialState() {
    let c = Store.getCommentById(this.props.params.id)
    return {
      loading: !c,
      smore: false, // show more menu from bottom
      _registwx: false,
      feed: Store.getFeedById(this.props.params.id),
      comments:  c || [],
      comment: null
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {
    if (this.state.feed && this.state.feed.pic) {
      this.insertImg(this.state.feed)
    }

    Store.addFeedListener(this.onFeedChange)
    Store.addCreateCommentListener(this.onCreateComment)
    Store.addVoteListener(this.onVoteChange)
    Store.addRemoveFeedListener(this.onRemoveChange)
  },

  componentWillUnmount() {
    this.revertTitle()
    Store.removeFeedListener(this.onFeedChange)
    Store.removeCreateCommentListener(this.onCreateComment)
    Store.removeVoteListener(this.onVoteChange)
    Store.removeRemoveFeedListener(this.onRemoveChange)
  },

  onFeedChange() {
    let c = Store.getCommentById(this.props.params.id)
    let feed = Store.getFeedById(this.props.params.id)
    if (c && !this.state._registwx) {
      this.insertImg(feed)
    }
    this.setState({
      loading: false,
      feed: feed,
      comments: c || []
    })
  },

  onCreateComment() {
    this.setState({
      loading: false,
      comment: null
    })
  },

  onVoteChange() {
    this.setState({
      loading: false,
      feed: Store.getFeedById(this.props.params.id)
    })
  },

  onRemoveChange() {
    this.setState({
      loading: false
    })
    let c = Store.getCommentById(this.props.params.id)
    if (!c) {
      this.transitionTo('tab', this.props.params)
    }
  },

  handleClick(type, e) {
    e.preventDefault();
    // if (!Store.getSelf()) {
    //   return this.transitionTo('login', this.props.params)
    // }
    this.setLoading(true);
    let obj = {
      type: type
    };
    voteFeed(this.props.params.id, obj);
  },

  setLoading(obj) {
    this.setState({
      loading: !!obj
    })
  },

  handleComment(e) {
    this.setState({
      comment: e.target.value
    })
  },

  sendComment(e) {
    e.preventDefault()
    let obj = {
      content: this.state.comment
    }
    this.setLoading(true)
    createComment(this.props.params.id, obj)
  },

  handleShare(e) {
    e.preventDefault()
    // if (typeof document != undefined) {
    //   document.title = str
    // }
    Crouton.showInfo('请使用浏览器的分享功能')
  },

  handleDelete(e) {
    e.preventDefault()
    this.setState({
      loading: true
    })
    removeFeed(this.props.params.id)
  },

  revertTitle() {
    // rollback
    if (typeof document != undefined) {
      document.title = '颜值俱乐部'
      document.getElementById('wx_suck').src = ''
    }
  },

  getScore(score) {
    return (score / 1000).toFixed(1)
  },

  // hack to share in wechat
  insertImg(feed) {
    if (!feed) return
    if (typeof document != undefined) {
      this.setState({
        _registwx: true
      })
      document.title = bio(this.getScore(feed.score))
      document.getElementById('wx_suck_img').src = feed.pic
    }
  },

  // registerWxMenu(feed) {
    // if (typeof wx != undefined) {
    //   this.setState({
    //     _registwx: true
    //   })
    //   let str = bio(feed.score)
    //   console.log('called')
    //   console.log({
    //     title: str,
    //     link: window.location.href,
    //     imgUrl: feed.pic,
    //     trigger: function (res) {
    //       alert('trigger')
    //     },
    //     success: function (res) {
    //       Crouton.showInfo('恭喜你分享成功了')
    //     },
    //     cancel: function (res) {
    //     },
    //     fail: function (res) {
    //       Crouton.showInfo('分享失败了再试一次呗')
    //     }
    //   })
    //   // document.title = str
    //   wx.onMenuShareTimeline({
    //     title: str,
    //     link: window.location.href,
    //     imgUrl: feed.pic,
    //     trigger: function (res) {
    //       alert('trigger')
    //     },
    //     success: function (res) {
    //       Crouton.showInfo('恭喜你分享成功了')
    //     },
    //     cancel: function (res) {
    //     },
    //     fail: function (res) {
    //       Crouton.showInfo('分享失败了再试一次呗')
    //     }
    //   })
      // wx.onMenuShareAppMessage({
      //   title: str, // 分享标题
      //   desc: str, // 分享描述
      //   link: window.location.href, // 分享链接
      //   imgUrl: feed.pic, // 分享图标
      //   success: function () {
      //     // 用户确认分享后执行的回调函数
      //   },
      //   cancel: function () {
      //     // 用户取消分享后执行的回调函数
      //   }
      // })
      // wx.error(function (res) {
      //   alert(res.errMsg)
      // })
    // }
  // },

  goToAuthor(e) {
    e.preventDefault()
    let obj = this.props.params

    this.transitionTo('user', {uid: this.state.feed.user_id, tab: obj.tab})
  },

  showMore(e) {
    e.preventDefault()
    if (!this.state.smore) {
      this.setState({
        smore: true
      })
    }
  },

  onAfterDismiss() {
    this.setState({
      smore: false
    })
  },

  handleReport(e) {
    Crouton.showInfo('功能暂未开通')
  },

  render() {
    let cts = null
    if (this.state.comments.length <= 0) {
      cts =  <div>暂无评论</div>
    } else {
      cts = this.state.comments.map((c, i) => {
        return <Comment {...c} key={i} />
      })
    }
    let selfObj = Store.getSelf()
    let feed = this.state.feed || {}
    let date = moment(feed.gmt_create).locale('zh-cn').startOf('minute').fromNow()

    let actions = [{
      name: '举报',
      listener: this.handleReport
    }]

    if (selfObj && selfObj.id == feed.user_id) {
      actions.unshift({
        name: '删除',
        listener: this.handleDelete
      })
    }

    return (
      <Modal show loading={this.state.loading}>
        <div className='header'>
          <div className='image'>
            <div><img src={feed.pic} /></div>
          </div>
          <div className='share'>
            <a className='modal--control' onClick={this.handleShare}><span className='icon-s'></span></a>
          </div>
          <div className='vote up'>
            <a href='#' disabled={this.state.loading} onClick={this.handleClick.bind(null, 'up')}><span className='icon-h'></span></a>
          </div>
          <div className='vote down'>
            <a href='#' disabled={this.state.loading} onClick={this.handleClick.bind(null, 'down')}><span>呵</span></a>
          </div>
          <div className='author'>
            <div className='name'>
              <a onClick={this.goToAuthor}><span>{feed.user_name}</span></a>
              <span className='time'>{date}</span>
            </div>
            <div className='more'>
              <a onClick={this.showMore}><span className='i-more'></span></a>
            </div>
            <div className='score'>
              <span>{this.getScore(feed.score||0)}</span>
            </div>
          </div>
        </div>
        <div className='comments'>
          {cts}
        </div>
        <div className='footer'>
          <div className='input'>
            <input type='text' value={this.state.comment} onChange={this.handleComment}  placeholder='输入评论' />
            <button
              className='button primary'
              disabled={this.state.loading || !this.state.comment}
              onClick={this.sendComment}
              >发送</button>
          </div>
        </div>
        <BottomMenu
        show={this.state.smore}
        actions={actions}
        onAfterDismiss={this.onAfterDismiss}/>
      </Modal>
    )
  }
})

export default Detail
