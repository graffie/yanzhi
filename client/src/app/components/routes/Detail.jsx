import React from 'react'
import { Navigation, State } from 'react-router'

import Modal from '../views/Modal'


let Detail  = React.createClass({

  propTypes: {
    // id: React.PropTypes.number,
    // url: React.PropTypes.string,
    // score: React.PropTypes.number
  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {}
  },

  mixins: [Navigation, State],

  handleClick(type, e) {
    e.preventDefault()

    this.transitionTo('login', this.getParams())

    if(type == 'up') {

    } else if (type == 'down') {

    }
  },

  render() {
    return (
      <Modal show>
        <div className='header'>
        <div className='image'>
          <div><img src='http://www.it.com.cn/games/image/news/2011/01/27/14/meinv012708.jpg' /></div>
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
            <a href='#'><span>xeodou</span></a>
            <span>1 天前</span>
      </div>
      <div className='comments'>
        <div className='comment'>
          <a>
            <img className='avatar' src='https://avatars1.githubusercontent.com/u/914595?v=3&s=460'/>
            <span>xeodou</span>
          </a>
          <div className='body'>
            App Store Launch Stories are handpicked interviews with world leading app entrepreneurs. I’m the host, Paul Kemp and its very exciting being on Product Hunt. I have an archive of over 400 app founder interviews, so I know how to get the best from guests.
          </div>
        </div>
        <div className='comment'>
          <a>
            <img className='avatar' src='https://avatars1.githubusercontent.com/u/914595?v=3&s=460' />
          </a>
          <p>hahahhahahahahhahahaha</p>
        </div>
        <div className='comment'>
          <a>
            <img className='avatar' src='https://avatars1.githubusercontent.com/u/914595?v=3&s=460' />
          </a>
          <p>hahahhahahahahhahahaha</p>
        </div>
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
