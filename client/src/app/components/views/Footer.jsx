import React from 'react'
import {Navigation} from 'react-router'

let Footer = React.createClass({

  mixins: [Navigation],

  handleClick(type, e) {
    this.transitionTo('tab', {tab: type})
  },

  handlePhotoUpload() {

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
            <input type='file' accept='image/*' capture='camera'/>
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
