import React from 'react'
import {Navigation, State} from 'react-router'

import cache from '../../utils/cache'

let Footer = React.createClass({

  mixins: [Navigation, State],

  handleClick(type, e) {
    e.preventDefault()
    this.transitionTo('tab', {tab: type})
  },

  handlePhotoUpload(e) {
    e.preventDefault()

    let file = e.target.files[0]
    if (!file) return
    cache.set(file)

    let obj = this.getParams()
    obj.tab = obj.tab || 'explore'
    this.transitionTo('upload', obj)
  },

  render() {
    return (
      <footer id='footer'>
        <div className='items'>
          <div className='item first'>
            <a href='javascript:;' onClick={this.handleClick.bind(null, 'explore')}><span className='icon-f'></span></a>
          </div>
          <div className='item second'>
            <a href='javascript:;' ><span className='icon-i'></span></a>
            <input type='file' accept='image/*' capture='camera' onChange={this.handlePhotoUpload}/>
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
