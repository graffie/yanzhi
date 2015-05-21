import React from 'react'
import { Navigation, State } from 'react-router'

import Modal from '../views/Modal'
import cache from '../../utils/cache'

let Login  = React.createClass({

  statics: {
    willTransitionFrom(transition, component) {
      cache.set()
    }
  },

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

  componentDidMount() {
    if (!this.kit && typeof window != undefined && window.ImglyKit) {
      this.kit = new ImglyKit({
        renderer: 'canvas', // Defaults to 'webgl', uses 'canvas' as fallback
        assetsUrl: 'static/images', // The URL / path where all assets are
        container: document.querySelector('#image-container'),
        image: this.refs.image.getDOMNode(),
        ui: {
          enabled: true
        },
        renderOnWindowResize: true // Our editor's size is relative to the window size
      })
    }
  },

  handleImageLoad() {
    if (this.kit) {
      this.kit.run()
    }
  },

  componentWillUnmount() {
    cache.set()
  },

  render() {
    return (
      <Modal show>
        <div className='upload'>
          <div className='header'>
            <button className='button primary'>上传啦</button>
          </div>
          <div className='editor' id='image-container'>
            <div className='image'>
              <div><img ref='image' onLoad={this.handleImageLoad} src={URL.createObjectURL(this.state.file)} /></div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Login
