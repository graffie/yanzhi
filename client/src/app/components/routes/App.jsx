// Their code
import React from 'react'
import { RouteHandler } from 'react-router'

// Our code
import Header from '../views/Header'
import Footer from '../views/Footer'
import Crouton from '../views/Crouton'
import {me} from '../../actions/AppActionCreator'

let App = React.createClass({

  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      me().then(() => {
        callback()
      }).catch((err) => {
        callback()
      })
    }
  },

  getInitialState: function() {
    return {
      user: {}
    };
  },

  componentWillMount() {

  },

  render() {
    return (
      <div>
        <Header />
        <RouteHandler />
        <Footer />
        <Crouton />
      </div>
    )
  }
})

export default App
