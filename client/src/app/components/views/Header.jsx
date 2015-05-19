import React from 'react'

export default class Header extends React.Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <header id="header">
        <nav className="logo">
          <h1>颜值俱乐部</h1>
        </nav>
      </header>
    )
  }
}
