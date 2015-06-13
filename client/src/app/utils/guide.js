// User guide
'use strict'

class Guide {
  constructor(opts) {
    opts || (opts = {})
    this.prefix = opts.prefix || 'guide'
    this.steps = []
  }

  add(step) {
    if (!step || !step.name) {
      return console.log('every step requires a name.')
    }
    this.steps.push(step)
  }

  show(name, el) {
    let s = this.status()
    // If the step is gone pass.
    if (s && s.step >= this.steps.length) {
      return
    }
    let j;
    for (var i = 0; i < this.steps.length; i++) {
      if (this.steps[i].name == name) {
        j = i
        break;
      }
    }
    if (typeof j == 'number') {
      this.steps[j].element = el
      el.className += ' highlight'
      el.parentNode.appendChild(this.template(this.steps[j]))
    }
  }

  hide(name) {
    let s = this.status()
      // If the step is gone pass.
    if (s && s.step >= this.steps.length) {
      return true
    }
    let step, j;
    for (var i = 0; i < this.steps.length; i++) {
      if (this.steps[i].name == name) {
        j = i
        step = this.steps[i]
      }
    }

    if (step) {
      if (step.element) {
        let cx = step.element.className
        let arr = cx.split(' ')
        if (arr[arr.length - 1] == 'highlight') {
          arr.pop()
        }
        step.element.className = arr.join(' ')

        let node = document.getElementsByClassName(this.prefix)
        if (node[0]) {
          node[0].remove()
        }
        this.status({step: j+1})
      }
    }
    return true
  }

  template(step) {
    let node = document.createElement('div')
    node.className = this.prefix
    node.innerHTML = template(this.prefix, step.name, step.content)
    let self = this

    function listener(e) {
      e.preventDefault()
      if (step.hook) {
        return
      }
      self.status()
      e.target.remove()
    }
    node.addEventListener('click', listener)
    node.addEventListener('touchstart', listener)
    return node
  }

  status(step) {
    if (!step) {
      let obj = null
      try {
        obj = JSON.parse(window.localStorage.getItem(this.prefix))
      } catch (err) {
        obj = {}
      }
      return obj
    }
    window.localStorage.setItem(this.prefix, JSON.stringify(step))
  }

  // @params
  // @name
  // @content
  // @hook
  // {
  //   name: "name",
  //   content: "content",
  //   hook: bool
  // }
  Step(name, content, hook) {
    if (typeof content === 'boolean') {
      hook = content
      content = null
    }
    return {
      name: name,
      content: content,
      hook: hook
    }
  }
}

function template(prefix, name, content) {
  return `<div class="${prefix}-box ${name || ''}">
      <div class="${prefix}-highlight ${name || ''}"></div>
      <div class="${prefix}-content">
        <span>${content || ''}</span>
      </div>
    </div>`
}

exports.Guide = Guide
module.exports = exports._guide || (exports._guide = new Guide())
