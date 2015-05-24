import React from 'react'
import { Navigation, State, Link } from 'react-router'
let {PropTypes} = React

let PhotoItem = React.createClass({

  propTypes: {
    content: PropTypes.string,
    gmt_create: PropTypes.string,
    gmt_modified: PropTypes.string,
    id: PropTypes.number.isRequired,
    user_id: PropTypes.number.isRequired,
    user_name: PropTypes.string
  },

  getDefaultProps() {
    return {
    }
  },

  mixins: [Navigation, State],

  render() {
    let obj = this.getParams()
    obj.uid = this.props.user_id
    return (
      <div className='comment'>
        <Link to='user' params={obj}>
          <img className='avatar'/>
          <span>{this.props.user_name}</span>
        </Link>
        <div className='body'>{this.props.content}</div>
      </div>
    )
  }
})

export default PhotoItem
