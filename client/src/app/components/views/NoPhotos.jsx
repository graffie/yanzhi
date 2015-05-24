import React from 'react'

export default class NoPhotos extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className='photos'>
          <div className='no'>您尚未上传任何照片\-(o_o)-/</div>
      </div>
    )
  }
}
