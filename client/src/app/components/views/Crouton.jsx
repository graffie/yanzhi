import React from 'react'
import Crouton from 'react-crouton'

import Store from '../../stores/AppStore'

export default React.createClass({

  getInitialState() {
    return {
      crouton: {
        id: 1,
        message: '',
        type: ''
      }
    }
  },

  componentWillMount() {
    Store.addCroutonListener(this.onChange)
  },

  componentWillUnmount() {
    Store.removeListener(this.onChange)
  },

  onChange() {
    let obj = Store.getCrouton()
    obj.id = Date.now()
    obj.hidden = false
    this.setState({
      crouton: obj
    });
  },

  render() {
    return (
      <Crouton
           id={this.state.crouton.id}
           message={this.state.crouton.message}
           type={this.state.crouton.type}
           buttons={this.state.crouton.buttons}
           hidden={this.state.crouton.hidden}
        />
    )
  }
})

