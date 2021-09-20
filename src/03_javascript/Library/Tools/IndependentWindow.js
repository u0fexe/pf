import bind from '../Utils/bind.js'

export default class IndependentWindow {
  constructor(node, settings) {
    this.node = node
    this.settings = {
      closeDelay: 0,
      esc: false,
      out: false,
      ...settings
    }

    bind(['open', 'close', 'onEsc', 'onOut'], this)

    this.active = false
  }

  onEsc(e) {
    if(e.key === 'Escape') {
      this.close()
    }
  }

  onOut(e) {
    if(!this.node.contains(e.target)) {
      this.close()
    }
  }

  open() {
    if(this.active) return this.close()

    if(this.settings.closeDelay) {
      this.node.classList.add('ready')
      setTimeout(() => this.node.classList.add('active'), 0)
    } else {
      this.node.classList.add('active')
    }

    if(this.settings.esc) {
      document.addEventListener('keydown', this.onEsc)
    }

    if(this.settings.out) {
      setTimeout(() => document.addEventListener('click', this.onOut), 0)
    }

    this.active = true
  }

  close() {
    if(this.settings.closeDelay) {
      this.node.classList.remove('active')
      setTimeout(() => this.node.classList.remove('ready'), this.settings.closeDelay)
    } else {
      this.node.classList.remove('active')
    }

    if(this.settings.esc) {
      document.removeEventListener('keydown', this.onEsc)
    }

    if(this.settings.out) {
      document.removeEventListener('click', this.onOut)
    }

    this.active = false
  }
}