import DeviceDependent from './DeviceDependent.js'
import Events from './Events.js'
import bind from '../Utils/bind.js'
import debounce from '../Utils/debounce.js'

export default class Switch extends DeviceDependent {
  constructor(node) {
    super(
      node,
      {
        event: 'click',
        effect: 'active',
        attribute: null,
        data: null,
        targets: [],
        toggle: false,
        once: false,
        transition: 1000
      }
    )

    this.events = new Events('in', 'out')
    this.innerTimeout = {}
    this.active = false
    this.targetsObservers = []

    bind(['resize', 'in', 'out'], this)
    new ResizeObserver(debounce(this.resize)).observe(this.node)
  }

  resize() {
    super.resize()
  }

  $applyNewMedia() {
    this.destroyOldFunctional()
    this.createNewFunctional()
  }

  $disable() {
    this.destroyOldFunctional()
  }

  createNewFunctional() {
    if(this.currentMedia.event === 'mouseenter' && this.currentMedia.toggle) {
      this.node.addEventListener('mouseenter', this.in)
      this.node.addEventListener('mouseleave', this.out)
    } else {
      this.node.addEventListener(this.currentMedia.event, this.in)
    }
  }

  destroyOldFunctional(media = this.previousMedia) {
    if(media.event === 'mouseenter' && media.toggle) {
      this.node.removeEventListener('mouseenter', this.in)
      this.node.removeEventListener('mouseleave', this.out)
    } else {
      this.node.removeEventListener(media.event, this.in)
    }
  }

  addEffect() {
    clearTimeout(this.innerTimeout.removeEffect)
    this.currentMedia.targets.forEach(target => {
      target.classList.add('ready')

      if(this.currentMedia.property && this.currentMedia.data) {
        target.setAttribute(this.currentMedia.property, this.currentMedia.data)
      }
    })

    this.node.classList.add('ready')

    setTimeout(() => {
      this.currentMedia.targets.forEach(target => target.classList.add(this.currentMedia.effect))
      this.node.classList.add(this.currentMedia.effect)
    }, 0)
  }

  removeEffect() {
    clearTimeout(this.innerTimeout.removeEffect)

    this.currentMedia.targets.forEach(target => {
      target.classList.remove(this.currentMedia.effect)

      if(this.currentMedia.property && this.currentMedia.data) {
        target.removeAttribute(this.currentMedia.property)
      }
    })
    this.node.classList.remove(this.currentMedia.effect)

    this.innerTimeout.removeEffect = setTimeout(() => {
      this.currentMedia.targets.forEach(target => target.classList.remove('ready'))
      this.node.classList.remove('ready')
    }, this.currentMedia.transition)
  }

  in() {
    if(this.currentMedia.event !== 'mouseenter' && this.currentMedia.toggle && this.active) {
      return this.out()
    }

    this.addEffect()

    this.active = true

    this.events.notify('in')

    if(this.currentMedia.once) {
      return this.destroyOldFunctional(this.currentMedia)
    }
  }

  out() {
    this.removeEffect()

    this.active = false
    this.events.notify('out')
  }
}

export function findAllSwitches() {
  return [...document.querySelectorAll('[data-switch]')].map(node => new Switch(node))
}