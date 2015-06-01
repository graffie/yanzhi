import React from 'react'
import cx from 'classnames'

export default class Loading extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    let style = {
      display: this.props.loading ? 'block' : 'none'
    }
    if (this.props.position) {
      style.position = this.props.position
    }
    let c = cx('show', {
      'heartbeat-loader': this.props.loading && !this.props.isHehe,
      'hehe-loader': this.props.loading && this.props.isHehe
    })
    return (
      <div
      id='loading'
      style={style}
      className={c} />
    )
  }
}

Loading.propTypes = {
  loading: React.PropTypes.bool,
  position: React.PropTypes.string,
  isHehe: React.PropTypes.bool
}

Loading.defaultProps = {
  isHehe: false
}
