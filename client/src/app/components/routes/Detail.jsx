import React from 'react'
import { Navigation, State, Link } from 'react-router'
import moment from 'moment'

import Modal from '../views/Modal'
import Comment from '../views/Comment'
import Store from '../../stores/AppStore'
import {Crouton, getFeed} from '../../actions/AppActionCreator'

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
      comments:  c || []
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {
    Store.addFeedListener(this.onFeedChange)
  },

  componentWillUnmount() {
    Store.removeFeedListener(this.onFeedChange)
  },

  onFeedChange() {
    this.setState({
      loading: false,
      feed: Store.getFeedById(this.props.params.id),
      comments: Store.getCommentById(this.props.params.id)
    })
  },

  handleClick(type, e) {
    e.preventDefault()

    this.transitionTo('login', this.props.params)

    if(type == 'up') {

    } else if (type == 'down') {

    }
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

    let {params} = this.props
    params.uid = feed.user_id || 'me'
    let date = moment(feed.gmt_create).locale('zh-cn').startOf('day').fromNow()

    return (
      <Modal show loading={this.state.loading}>
        <div className='header'>
         <div className='image'>
           <div><img src={feed.pic} /></div>
         </div>
         <div className='share'>
           <a className='modal--control'><span className='icon-s'></span></a>
         </div>
         <div className='vote up'>
           <a href='#' onClick={this.handleClick.bind(null, 'up')}><span className='icon-h'></span></a>
         </div>
        <div className='vote down'>
           <a href='#' onClick={this.handleClick.bind(null, 'up')}><span>呵</span></a>
          </div>
        </div>
        <div className='author'>
          <Link to='user' params={params}>
            <span>{feed.user_name}</span>
          </Link>
          <span>{date}</span>
        </div>
        <div className='comments'>
          {cts}
        </div>
        <div className='footer'>
          <div className='input'>
            <input type='text' placeholder='输入评论' />
            <button>发送</button>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Detail
