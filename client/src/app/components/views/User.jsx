import React from 'react'

import PhotoList from './PhotoList'
import NoPhotos from './NoPhotos'

export default class User extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    let {user} = this.props
    let feeds = null
    if (user.feeds.length > 0 ) {
      feeds = <PhotoList feeds={user.feeds} />
    } else {
      feeds = <NoPhotos />
    }
    return (
      <div className='person '>
        <div className='header'>
          <h2>{user.name}</h2>
          <div className='line'></div>
          <div className='avatar'>
            <img src={user.avatar} />
          </div>
        </div>
        {feeds}
      </div>
    )
  }
}

User.defaultProps = {
  user: {
    photos: []
  }
}
