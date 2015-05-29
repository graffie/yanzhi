import React from 'react'
import {Navigation, State} from 'react-router'

import PhotoList from './PhotoList'
import NoPhotos from './NoPhotos'
import BottomMenu from './BottomMenu'
import Store from '../../stores/AppStore'
import {logout} from '../../actions/AppActionCreator'

let  User =  React.createClass({

  getDefaultProps() {
    return {
      user: {
        photos: []
      }
    }
  },

  getInitialState() {
    return {
      smore: false
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {
    Store.addLogoutListener(this.onLogoutSuccess)
  },

  componentWillUnmount() {
    Store.removeLogoutListener(this.onLogoutSuccess)
  },

  onLogoutSuccess() {
    this.transitionTo('tab', {tab: 'explore'})
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

  handleLogout() {
    logout()
  },

  render() {
    let {user} = this.props
    let feeds = null
    if (user.feeds.length > 0 ) {
      feeds = <PhotoList feeds={user.feeds} />
    } else {
      feeds = <NoPhotos />
    }
    let actions = [{
      name: '退出',
      listener: this.handleLogout
    }]
    return (
      <div className='person '>
        <div className='setting'>
          <a onClick={this.showMore}><span className='i-cog'></span></a>
        </div>
        <div className='header'>
          <h2>{user.name}</h2>
          <div className='line'></div>
          <div className='avatar'>
            <img src={user.avatar} />
          </div>
        </div>
        {feeds}
        <BottomMenu
          show={this.state.smore}
          actions={actions}
          onAfterDismiss={this.onAfterDismiss}/>
      </div>
    )
  }
})

export default User
