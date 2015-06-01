import React from 'react'
import { Navigation, State, History} from 'react-router'
import { trim } from 'validator'

import Modal from '../views/Modal'
import AppActionCreator from '../../actions/AppActionCreator'
import Store from '../../stores/AppStore'

let Signup  = React.createClass({

  propTypes: {
  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {
      loading: false,
      name: '',
      password: ''
    }
  },

  mixins: [Navigation, State, History],

  componentWillMount() {
    Store.addSignupListener(this.onListener)
  },

  componentWillUnmount() {
    Store.removeSignupListener(this.onListener)
  },

  onListener() {
    this.setState({
      loading: false
    })
    if (Store.getSelf()) {
      if (History.length > 1) {
        this.goBack()
      } else {
        this.transitionTo('tab', this.props.params)
      }
    }
  },

  goToLogin(e) {
    e.preventDefault()
    this.replaceWith('login', this.getParams())
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
      this.setState({
        loading: true
      })
      AppActionCreator.signup(this.state)
    }
  },

  render() {
    return (
      <Modal show loading={this.state.loading}>
        <div className='login'>
          <div className='form'>
            <div className='field'>
              <div className='control'>
                <span>用户名</span>
              </div>
              <input type='text' name='name'
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
              <input className='button primary' type='submit' value='注册'  onClick={this.handleSubmit}/>
            </div>
            <div className='control link'>已有账号，<a href='#' onClick={this.goToLogin}>点击登录</a></div>
          </div>
          <div className='form tips'>
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
