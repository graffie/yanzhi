// Their code
import React  from 'react'
import { RouteHandler, Navigation, State } from 'react-router'

// Our code
import PhotoList from '../views/PhotoList'
import User from '../views/User'
import Loading from '../views/Loading'
import {Crouton, getFeeds} from '../../actions/AppActionCreator'
import Store from '../../stores/AppStore'

let Tab = React.createClass({

  statics: {
    willTransitionTo: function (transition, params) {
      switch (params.tab) {
        case 'user':
          if (!Store.getUser()) {
            transition.redirect('login', {tab: 'explore'})
          }
          break;
        default:
          if (Store.getFeeds().length <= 0) {
            getFeeds()
          }
          break;
      }
    }
  },

  getInitialState: function() {
    return {
      loading: true,
      user: {},
      feeds: Store.getFeeds()
    }
  },

  mixins: [Navigation, State],

  componentWillMount() {
    Store.addFeedsListener(this.onFeedsChange)
  },

  componentWillUnmount() {
    Store.removeFeedsListener(this.onFeedsChange)
  },

  onFeedsChange() {
    this.setState({
      loading: false,
      feeds: Store.getFeeds()
    });
  },

  render() {
    var section = <PhotoList feeds={this.state.feeds}/>

    let {tab} = this.getParams()
    if(tab == 'user') {
      section = <User user={this.state.user} />
    }

    return (
      <div>
        <div id='main'>{section}</div>
        <RouteHandler />
        <Loading loading={this.state.loading}/>
      </div>
    )
  }
})

export default Tab

