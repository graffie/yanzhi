import React from 'react/addons'
import { Navigation, State } from 'react-router'
let {PropTypes} = React
let {PureRenderMixin} = React.addons

let PhotoItem = React.createClass({

  propTypes: {
    content: PropTypes.string,
    gmt_create: PropTypes.string,
    gmt_modified: PropTypes.string,
    id: PropTypes.number,
    // lat: null
    // lng: null
    // location: null
    pic: PropTypes.string,
    score: PropTypes.number,
    user_id: PropTypes.number,
    user_name: PropTypes.string
  },

  getDefaultProps() {
    return {
    }
  },

  mixins: [Navigation, State, PureRenderMixin],

  handleClick(e) {
    let obj = this.getParams()
    obj.id = this.props.id
    obj.tab = obj.tab || 'explore'
    this.transitionTo('item', obj)
  },

  render() {
    return (
      <div className='item' onClick={this.handleClick}>
        <div><img src={this.props.pic} /></div>
        <div className='score'>
          <span className='icon-h'>{(this.props.score / 1000).toFixed(1)}</span>
        </div>
      </div>
    )
  }
})

export default PhotoItem
