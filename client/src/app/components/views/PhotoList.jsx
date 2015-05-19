import React from 'react'

import PhotoItem from './PhotoItem'

export default class PhotoList extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    let ls = this.props.photos.map((p, i) => {
        return <PhotoItem {...p} key={i}/>
    })
    return (
      <div className='photos'>
        {ls}
      </div>
    )
  }
}

PhotoList.defaultProps = {
  photos: []
}
