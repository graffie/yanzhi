import React from 'react'
import { Navigation, State, History } from 'react-router'
import { trim } from 'validator'

import Modal from '../views/Modal'
import AppActionCreator from '../../actions/AppActionCreator'
import Store from '../../stores/AppStore'

let Login  = React.createClass({

  propTypes: {
  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {
      name: '',
      password: ''
    }
  },

  mixins: [Navigation, State, ],

  componentWillMount() {
    Store.addLoginListener(this.onListener)
  },

  componentWillUnmount() {
    Store.removeLoginListener(this.onListener)
  },

  onListener() {
    if(History.length > 1) {
      this.goBack()
    } else {
      this.transitionTo('tab', this.getParams())
    }
  },

  goToSignup(e) {
    e.preventDefault()
    this.replaceWith('signup', this.getParams())
  },

  handleOnBlur(e) {
    e.preventDefault()
    this.setState({
        name: trim(e.target.value)
    });
  },

  handleOnChange(e) {
    e.preventDefault()
    if (e.target.name == 'name') {
      this.setState({
        name: e.target.value
      });
    } else {
      this.setState({
        password: e.target.value
      });
    }
  },

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.name.length >= 0 && this.state.password.length >= 0) {
      AppActionCreator.login(this.state)
    }
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
              <input type='phone' name='name'
                value={this.state.name}
                onChange={this.handleOnChange}
                onBlur={this.handleOnBlur}/>
            </div>
            <div className='field'>
              <div className='control'>
                <span>密  码</span>
              </div>
              <input type='password' name='password'
                value={this.state.password}
                onChange={this.handleOnChange} />
            </div>
            <div className='control'>
              <input className='button primary' type='submit' value='登录' onClick={this.handleSubmit} />
            </div>
            <div className='control link'>没有账号，<a href='#' onClick={this.goToSignup}>点击注册</a></div>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Login
