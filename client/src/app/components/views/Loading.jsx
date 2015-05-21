import React from 'react'

export default class Loading extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    let style = {
      display: this.props.loading ? 'block' : 'none'
    }
    return (
      <div id='loading'
      style={style}
      className={this.props.loading ? 'flower-loader' : ''} />
    )
  }
}

Loading.propTypes = {
  loading: React.PropTypes.bool
}

Loading.defaultProps = {

}
