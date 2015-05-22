import React from 'react'
import cx from 'classnames'
import { Navigation, State, History } from 'react-router'

import Loading from './Loading'

let Modal = React.createClass({

  getDefaultProps() {
    return {
      show: false
    };
  },

  getInitialState() {
    return {
      show: this.props.show
    };
  },

  mixins: [Navigation, State],

  componentWillReceiveProps(nextProps) {
    if(nextProps.show) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'scroll'
    }
  },

  componentDidMount() {
    if(this.props.show) {
      document.body.style.overflowY = 'hidden'
    }
  },

  componentWillUpdate(nextProps, nextState) {
    document.body.style.overflowY = 'scroll'
  },

  handleClose(e) {
    e.preventDefault()
    this.setState({
      show: false
    })

    if(History.length > 1) {
      this.goBack()
    } else {
        this.transitionTo('tab', this.getParams())
    }

    document.body.style.overflowY = 'scroll'
  },

  render() {
    return (
       <div className={cx('modal', {hide: !this.state.show})} >
         <div className='modal--content'>
           <a className='modal--control v-close' title='Close' onClick={this.handleClose}>
             <svg width='12px' height='12px' viewBox='0 0 12 12' version='1.1' xmlns='http://www.w3.org/2000/svg'>
               <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fill-rule='evenodd'>
                 <path d='M5,5 L5,-0.99912834 C5,-1.55536914 5.4477153,-2 6,-2 C6.5561352,-2 7,-1.5518945 7,-0.99912834 L7,5 L12.9991283,5 C13.5553691,5 14,5.4477153 14,6 C14,6.5561352 13.5518945,7 12.9991283,7 L7,7 L7,12.9991283 C7,13.5553691 6.5522847,14 6,14 C5.4438648,14 5,13.5518945 5,12.9991283 L5,7 L-0.99912834,7 C-1.55536914,7 -2,6.5522847 -2,6 C-2,5.4438648 -1.5518945,5 -0.99912834,5 L5,5 L5,5 Z' id='Rectangle-402' fill='#534540' transform='translate(6.000000, 6.000000) rotate(45.000000) translate(-6.000000, -6.000000) '></path>
               </g>
              </svg>
           </a>
           {this.props.children}
           <Loading loading={this.props.loading} position={'absolute'}/>
        </div>
      </div>
    )
  }
})

export default Modal
