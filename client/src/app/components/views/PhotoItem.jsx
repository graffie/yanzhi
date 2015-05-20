import React from 'react'
import { Navigation, State } from 'react-router'


let PhotoItem = React.createClass({

  propTypes: {
    id: React.PropTypes.number,
    url: React.PropTypes.string,
    score: React.PropTypes.number
  },

  getDefaultProps() {
    return {

    }
  },

  mixins: [Navigation, State],

  handleClick(e) {
    let obj = this.getParams()
    obj.id = this.props.id
    this.transitionTo('item', obj)
  },

  render() {
    return (
      <div className='item' onClick={this.handleClick}>
        <img src={this.props.url} />
        <div className='score'>
          <span className='icon-h'>{this.props.score.toFixed(1)}</span>
        </div>
      </div>
    )
  }
})

export default PhotoItem
