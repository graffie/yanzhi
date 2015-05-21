import React from 'react'
import { Navigation, State } from 'react-router'
import cx from 'classnames'

import Modal from '../views/Modal'
import cache from '../../utils/cache'
import {Crouton, uploadPhoto} from '../../actions/AppActionCreator'

let Login  = React.createClass({

  statics: {
    willTransitionFrom(transition, component) {
      cache.file = null
    }
  },

  propTypes: {

  },

  getDefaultProps() {
    return {}
  },

  getInitialState() {
    return {
      loading: true
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
      this.kit.ui.selectOperations({ only: 'filters, crop, rotation, stickers' });
    }

    if (cache.file) {
      let reader = new FileReader();
      reader.onloadstart = function(e) {

      }
      reader.onload = function (e) {
        if (this.refs.image) {
          this.refs.image.getDOMNode().src = e.target.result;
        }
      }.bind(this)
      reader.onloadend = function (e) {
        this.setState({
          loading: false
        })
      }.bind(this)
      reader.readAsDataURL(cache.file);
    }
  },

  handleImageLoad() {
    if (this.kit) {
      this.kit.run()
      this.kit.ui.controls.crop.selectRatios({ only: 'square'})
    }
  },

  componentWillUnmount() {
    cache.file = null
  },

  handleImageUpload(e) {
    if (!this.kit) {
      return Crouton.showInfo('您尚未选择任何照片，请点击关闭后重试')
    }
    this.kit.render('data-url', 'image/png')
      .then((data) => {
        uploadPhoto(data)
      }).catch((err) => {
        console.log(err)
      })
  },

  render() {
    return (
      <Modal show loading={this.state.loading}>
        <div className='upload'>
          <div className='header'>
            <button className='button primary' onClick={this.handleImageUpload}>上传啦</button>
          </div>
          <div className='editor' id='image-container'>
            <div className='image'>
              <div><img ref='image' onLoad={this.handleImageLoad} /></div>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
})

export default Login
