import React from 'react'

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
    return (
      <div id='loading'
      style={style}
      className={this.props.loading ? 'show heartbeat-loader' : ''} />
    )
  }
}

Loading.propTypes = {
  loading: React.PropTypes.bool,
  position: React.PropTypes.string
}

Loading.defaultProps = {

}
