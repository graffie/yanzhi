import React from 'react'
import { Navigation, State } from 'react-router'

import Modal from '../views/Modal'
import cache from '../../utils/cache'

let Login  = React.createClass({

  propTypes: {

  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {
      file: cache.get()
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {

  },

  componentWillUnmount() {
    cache.set()
  },

  render() {
    return (
      <Modal show>
       <div className='upload'>
        <div className='header'>
          <div className='image'>
            <div><img src={URL.createObjectURL(this.state.file)} /></div>
          </div>
        </div>
        <button className='button primary'>我要上传</button>
      </div>
      </Modal>
    )
  }
})

export default Login
