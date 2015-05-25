import React from 'react'
import { Navigation, State, Link } from 'react-router'
import moment from 'moment'

import Modal from '../views/Modal'
import Comment from '../views/Comment'
import Store from '../../stores/AppStore'
import bio from '../../utils/bio'
import {Crouton, getFeed, createComment, voteFeed} from '../../actions/AppActionCreator'

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
      feed: Store.getFeedById(this.props.params.id),
      comments:  c || [],
      comment: null
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {
    Store.addFeedListener(this.onFeedChange)
    Store.addCreateCommentListener(this.onCreateComment)
    Store.addVoteListener(this.onVoteChange)
  },

  componentWillUnmount() {
    Store.removeFeedListener(this.onFeedChange)
    Store.removeCreateCommentListener(this.onCreateComment)
    Store.removeVoteListener(this.onVoteChange)
  },

  onFeedChange() {
    let c = Store.getCommentById(this.props.params.id)
    this.setState({
      loading: false,
      feed: Store.getFeedById(this.props.params.id),
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
      loading: false
    });
  },

  handleClick(type, e) {
    e.preventDefault()
    // if (!Store.getSelf()) {
    //   return this.transitionTo('login', this.props.params)
    // }
    this.setLoading(true)
    let obj = {
      type: type
    }
    voteFeed(this.props.params.id, obj)
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
    let str = bio(this.state.feed.score)
    // if (typeof document != undefined) {
    //   document.title = str
    // }
    if (typeof wx != undefined) {
      wx.onMenuShareTimeline({
        title: str,
        link: window.location.href,
        imgUrl: this.state.feed.pic,
        trigger: function (res) {

        },
        success: function (res) {
          // Crouton.showInfo('分享成功')
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      })
    }
  },

  goToAuthor(e) {
    e.preventDefault()
    let obj = this.props.params

    this.transitionTo('user', {uid: this.state.feed.user_id, tab: obj.tab})
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

    let feed = this.state.feed || {}
    let date = moment(feed.gmt_create).locale('zh-cn').startOf('day').fromNow()

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
           <a href='#' onClick={this.handleClick.bind(null, 'up')}><span className='icon-h'></span></a>
         </div>
        <div className='vote down'>
           <a href='#' onClick={this.handleClick.bind(null, 'up')}><span>呵</span></a>
          </div>
        </div>
        <div className='author'>
          <a onClick={this.goToAuthor}>
            <span>{feed.user_name}</span>
          </a>
          <span>{date}</span>
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
      </Modal>
    )
  }
})

export default Detail
