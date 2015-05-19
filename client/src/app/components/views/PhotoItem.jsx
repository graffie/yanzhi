import React from 'react'

export default class PhotoItem extends React.Component {

  constructor(props) {
    super(props)

  }

  handleClick() {

  }

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
}

PhotoItem.propTypes = {
  id: React.PropTypes.number,
  url: React.PropTypes.string,
  score: React.PropTypes.number
}

PhotoItem.defaultProps = {

}
