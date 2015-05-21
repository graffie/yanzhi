import React from 'react'
import Crouton from 'react-crouton'

import Store from '../../stores/AppStore'

export default React.createClass({

  getInitialState() {
    return {
      crouton: {
        id: 0,
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

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.crouton.id > this.state.crouton.id
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
    if (this.state.crouton.id <= 0) return <div />
    return (
      <Crouton
           id={this.state.crouton.id}
           message={this.state.crouton.message}
           type={this.state.crouton.type}
           buttons={this.state.crouton.buttons}
           hidden={this.state.crouton.hidden}
           autoMiss={this.state.crouton.autoMiss}/>
    )
  }
})

