import React from 'react'
import {Navigation, State} from 'react-router'

import cache from '../../utils/cache'
import Store from '../../stores/AppStore'
import guide from '../../utils/guide'

let Footer = React.createClass({

  mixins: [Navigation, State],

  handleClick(type, e) {
    e.preventDefault()
    this.transitionTo('tab', {tab: type})
  },

  getRoute() {
    let obj = this.getParams()
    obj.tab = obj.tab || 'explore'
    return obj
  },

  componentDidMount() {
    if (this.isActive('app') || this.isActive('tab', this.getParams())) {
      guide.show('photo', this.refs.photo.getDOMNode())
    }
  },

  handlePhotoUpload(e) {
    e.preventDefault()

    let file = e.target.files[0]
    if (!file) return
    cache.file = file

    this.transitionTo('upload', this.getRoute())
    e.target.value = null
  },

  handleFileClick(e) {
    if (guide.hide('photo')) {
      if (!Store.getSelf()) {
        e.preventDefault()
        return this.transitionTo('login', this.getRoute())
      }
    }
  },

  render() {
    return (
      <footer id='footer'>
        <div className='items'>
          <div className='item first'>
            <a href='javascript:;' onClick={this.handleClick.bind(null, 'explore')}><span className='icon-f'></span></a>
          </div>
          <div ref='photo' className='item second'>
            <a href='javascript:;' ><span className='icon-i'></span></a>
            <input type='file' accept='image/*' capture='camera' onClick={this.handleFileClick} onChange={this.handlePhotoUpload}/>
          </div>
          <div className='item third'>
            <a href='javascript:;' onClick={this.handleClick.bind(null, 'user')}><span className='icon-u'></span></a>
          </div>
        </div>
      </footer>
    )
  }
})

export default Footer
