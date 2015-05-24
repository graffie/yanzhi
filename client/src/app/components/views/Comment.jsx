import React from 'react'
import { Navigation, State, Link } from 'react-router'
import cx from 'classnames'
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

  handleClick(e) {
    e.preventDefault()
    if (this.props.user_id <= 0)
      return
    let obj = this.getParams()
    obj.uid = this.props.user_id
    this.transitionTo('user', obj)
  },

  render() {
    let anymous = (this.props.user_id <= 0)
    let name =  anymous ? '匿名人士' : this.props.user_name
    return (
      <div className={cx('comment', {disable: anymous})}>
        <a href='javascript:;' onClick={this.handleClick}>
          <img className='avatar' src=''/>
          <span>{name}</span>
        </a>
        <div className='body'>{this.props.content}</div>
      </div>
    )
  }
})

export default PhotoItem
