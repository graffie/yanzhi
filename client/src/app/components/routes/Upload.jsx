import React from 'react'
import { Navigation, State } from 'react-router'
import cx from 'classnames'

import Modal from '../views/Modal'
import cache from '../../utils/cache'
import {Crouton, createFeed} from '../../actions/AppActionCreator'
import Store from '../../stores/AppStore'

let Upload  = React.createClass({

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
    Store.addCreateListener(this.onUploadChange)
  },

  componentWillUnmount() {
    cache.file = null
    Store.removeCreateListener(this.onUploadChange)
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
      let reader = new FileReader()
      reader.onloadstart = function(e) {
      }
      reader.onload = function (e) {
        if (this.refs.image) {
          let img = this.refs.image.getDOMNode()
          img.src = e.target.result
          // let exif = EXIF.readFromBinaryFile(e.target.result)
          // let ori = exif.Orientation
          // switch (ori) {
          //   case 6:
          //     break;
          //   case 3:
          //     Rotate(img, '180deg');
          //     break;
          //   case 8:
          //     Rotate(img, '270deg');
          //     break;
          // }
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

  onUploadChange() {
    this.setState({
      loading: false
    });
  },

  handleImageLoad() {
    if (this.kit) {
      this.kit.run()
      this.kit.ui.controls.crop.addRatio('square', '1', true);
      this.kit.ui.controls.crop.selectRatios({ only: 'square'})
    }
  },

  handleImageUpload(e) {
    if (!this.kit) {
      return Crouton.showInfo('您尚未选择任何照片，请点击关闭后重试')
    }
    this.kit.render('data-url', 'image/png')
      .then((data) => {
        this.setState({
          loading: true
        });
        createFeed({
           attachment: data,
           contentType: 'image/png'
        })
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

export default Upload
