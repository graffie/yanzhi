import React from 'react'

export default class Header extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <footer id='footer'>
        <div className='items'>
          <div className='item first'>
            <a href='#'><span className='icon-f'></span></a>
          </div>
          <div className='item second'>
            <a href='#'><span className='icon-i'></span></a>
            <input type='file' accept='image/*' capture='camera'/>
          </div>
          <div className='item third'>
            <a href='#'><span className='icon-u'></span></a>
          </div>
        </div>
      </footer>
    )
  }
}
