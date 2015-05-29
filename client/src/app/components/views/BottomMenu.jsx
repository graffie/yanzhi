import React from 'react'
import emptyFunction from 'react/lib/emptyFunction'

let {PropTypes} = React

let BottomMenu = React.createClass({

  propTypes: {
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        listener: PropTypes.func
      }))
  },

  getDefaultProps: function () {
    return {
      show: false,
      isDelable: false,
      actions: [],
      onBeforeDismiss: emptyFunction,
      onAfterDismiss: emptyFunction
    }
  },

  getInitialState: function() {
    return {
      hidden: !this.props.show
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) {
      this.setState({
        hidden: !nextProps.show
      })
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.hidden != this.state.hidden
  },

  dismiss() {
    this.props.onBeforeDismiss()
    this.setState({
      hidden: true
    })
    this.props.onAfterDismiss()
  },

  handleCancel(e) {
    e.preventDefault()
    this.dismiss()
  },

  handleClick(i, e) {
    e.preventDefault()
    this.dismiss()
    let a = this.props.actions[i]
    if (a && a.listener) {
      a.listener(e)
    }
  },

  render() {
    return (
      <div className='menu buttom' hidden={this.state.hidden}>
        <div className='actions'>
          {
            this.props.actions.map((a, i) => {
              return (
                <div className='action' key={i}>
                  <button onClick={this.handleClick.bind(null, i)}>{a.name}</button>
                </div>
              )
            })
          }
          <div className='action cancel'>
            <button onClick={this.handleCancel}>取消</button>
          </div>
        </div>
      </div>
    )
  }
})

export default BottomMenu
