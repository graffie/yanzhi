import React from 'react'

import PhotoList from './PhotoList'

export default class User extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    let {user} = this.props
    return (
      <div className='person '>
        <div className='header'>
          <h2>{user.name}</h2>
          <div className='line'></div>
          <div className='avatar'>
            <img src={user.avatar} />
          </div>
        </div>
       <PhotoList photos={user.photos} />
      </div>
    )
  }
}

User.defaultProps = {
  user: {
    photos: []
  }
}
