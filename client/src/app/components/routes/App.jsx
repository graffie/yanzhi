// Their code
import React from 'react'
import { RouteHandler } from 'react-router'

// Our code
import Header from '../views/Header'
import Footer from '../views/Footer'
import Crouton from '../views/Crouton'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <Header />
          <RouteHandler user={this.state.user}/>
        <Footer />
        <Crouton />
      </div>
    )
  }
}

App.propTypes = {

}

App.defaultProps = {

}
