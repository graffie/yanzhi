import React from 'react'
import { Navigation, State } from 'react-router'

import Modal from '../views/Modal'

let Login  = React.createClass({

  propTypes: {
  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {}
  },

  mixins: [Navigation, State],

  goToSignup(e) {
    e.preventDefault()

    this.transitionTo('signup', this.getParams())
  },

  render() {
    return (
      <Modal show>
        <div className='login'>
          <div className='form'>
            <div className='field'>
              <div className='control'>
                <span>用户名</span>
              </div>
              <input type='phone'/>
            </div>
            <div className='field'>
              <div className='control'>
                <span>密  码</span>
              </div>
              <input type='text' />
            </div>
            <div className='control'>
              <input className='button primary' type='submit' value='登录' />
            </div>
            <div className='control link'>没有账号，<a href='#' onClick={this.goToSignup}>点击注册</a></div>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Login
