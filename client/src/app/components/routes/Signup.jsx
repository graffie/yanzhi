import React from 'react'
import { Navigation, State } from 'react-router'

import Modal from '../views/Modal'

let Signup  = React.createClass({

  propTypes: {
  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {}
  },

  mixins: [Navigation, State],

  goToLogin(e) {
    e.preventDefault()

    this.transitionTo('login', this.getParams())

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
              <input className='button primary' type='submit' value='注册' />
            </div>
            <div className='control link'>已有账号，<a href='#' onClick={this.goToLogin}>点击登录</a></div>
          </div>
          <div className='form'>
            <div className='control tips'>
              <p>用户名可以是中文！</p>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Signup
