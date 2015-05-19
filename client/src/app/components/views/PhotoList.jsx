import React from 'react'

import PhotoItem from './PhotoItem'

export default class PhotoList extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    let ls = this.props.photos.map((p) => {
        return <PhotoItem {...p} />
    })
    return (
      <div class='photos'>
        {ls}
      </div>
    )
  }
}

PhotoList.defaultProps = {
  photos: []
}
