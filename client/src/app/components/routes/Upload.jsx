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


  render() {
    return (
      <Modal show>
       <div className='upload'>
        <div className='header'>
          <div className='image'>
            <div><img src='http://www.it.com.cn/games/image/news/2011/01/27/14/meinv012708.jpg' /></div>
          </div>
        </div>
        <button className='button primary'>我要上传</button>
      </div>
      </Modal>
    )
  }
})

export default Login
