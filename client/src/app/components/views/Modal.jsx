import React from 'react'
import emptyFunction from 'react/lib/emptyFunction'
import cx from 'classnames'
import { Navigation, State, History } from 'react-router'

import Loading from './Loading'

let Modal = React.createClass({

  propTypes: {
    onBeforeClose: React.PropTypes.func,
    onAfterClose: React.PropTypes.func,
    isHehe: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    show: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      show: false,
      onBeforeClose: emptyFunction.thatReturnsTrue,
      onAfterClose: emptyFunction
    };
  },

  getInitialState() {
    return {
      show: this.props.show
    };
  },

  mixins: [Navigation, State],

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  },

  componentDidMount() {
    if (this.props.show) {
      document.body.style.overflowY = 'hidden'
    }
  },

  componentWillUpdate(nextProps, nextState) {
    // document.body.style.overflowY = 'scroll'
  },

  handleClose(e) {
    e.preventDefault()
    let { onBeforeClose, onAfterClose } = this.props
    if (onBeforeClose()) {
      this.setState({
        show: false
      })

      if (History.length > 1) {
        this.goBack();
      } else {
        this.transitionTo('tab', this.getParams())
      }
      document.body.style.overflowY = 'scroll'
      onAfterClose()
    }
  },

  render() {
    return (
       <div className={cx('modal', {hide: !this.state.show})} >
         <div className='modal--content'>
           <a ref='close' className='modal--control v-close' title='Close' onClick={this.handleClose}>
             <span className='i-arrow-left'></span>
           </a>
           {this.props.children}
           <Loading loading={this.props.loading} position={'absolute'} isHehe={this.props.isHehe}/>
        </div>
      </div>
    )
  }
})

export default Modal
