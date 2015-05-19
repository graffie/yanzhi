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
          <span>{this.props.score}</span>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  id: React.PropType.number,
  url: React.PropType.string,
  score: React.PropType.number
}

App.defaultProps = {

}
