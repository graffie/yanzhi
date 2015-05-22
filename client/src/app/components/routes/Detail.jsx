import React from 'react'
import { Navigation, State, Link } from 'react-router'
import moment from 'moment'

import Modal from '../views/Modal'
import Comment from '../views/Comment'
import Store from '../../stores/AppStore'
import {Crouton, getFeed} from '../../actions/AppActionCreator'

let Detail  = React.createClass({

  statics: {
    willTransitionTo: function (transition, params) {
      if(!Store.getFeedById(params.id)) {
        transition.redirect('tab', params)
      } else {
        getFeed(params.id)
      }
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
    return {
      loading: true,
      feed: Store.getFeedById(this.props.params.id),
      comments: Store.getCommentById(this.props.params.id) || []
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
      comments: Store.getCommentById(this.props.params.id)
    });
  },

  handleClick(type, e) {
    e.preventDefault()

    this.transitionTo('login', this.props.params)

    if(type == 'up') {

    } else if (type == 'down') {

    }
  },

  render() {
    let cts = this.state.comments.map((c, i) => {
      return <Comment {...c} key={i} />
    })
    let feed = this.state.feed
    let {params} = this.props
    params.uid = feed.user_id

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
