import React from 'react'
import { Navigation, State, Link } from 'react-router'

import Modal from '../views/Modal'
import User from '../views/User'
import {Crouton, getUser} from '../../actions/AppActionCreator'
import Store from '../../stores/AppStore'

export default React.createClass({

  statics: {
    willTransitionTo(transition, params, query, cb) {
      if (!Store.getUser(params.id)) {
        getUser(params.uid)
      }
      cb()
    }
  },

  getInitialState() {
    let u = Store.getUser(this.props.params.id)
    return {
      loading: !u,
      user: u
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {
    Store.addUserListener(this.onUserChange)
  },

  componentWillUnmount() {
    Store.removeUserListener(this.onUserChange)
  },

  onUserChange() {
    this.setState({
      loading: false,
      user: Store.getUser(this.props.params.uid)
    })
  },

  render() {
    return (
      <Modal show loading={this.state.loading}>
        {this.state.loading ? null : <User user={this.state.user} />}
      </Modal>
    )
  }
})
