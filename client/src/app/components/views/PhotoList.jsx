import React from 'react'

import PhotoItem from './PhotoItem'

export default class PhotoList extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    let ls = this.props.feeds.map((f, i) => {
        return <PhotoItem {...f} key={i}/>
    })
    return (
      <div className='photos'>
        {ls}
      </div>
    )
  }
}

PhotoList.defaultProps = {
  feeds: []
}
