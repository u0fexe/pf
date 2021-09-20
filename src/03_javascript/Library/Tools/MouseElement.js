import Loop from "./Loop.js"
import DeviceDependent from "./DeviceDependent.js"
import on from "../Utils/on.js"
import bind from "../Utils/bind.js"
import lerp from "../Utils/lerp.js"
import resizer from "./Resizer.js"

let id = 0

export default class MouseElement extends DeviceDependent {
  constructor(node, settings = {}) {
    super(node, {
      ease: 0.1,
      fromCenter: false,
      resetOnLeave: false,
      notify: true,
      ...settings
    })


    this.mouse = {
      x: 0,
      y: 0,
      ix: 0,
      iy: 0,
    }

    this.enter = {
      v: 0,
      iv: 0
    }

    this.size = {
      w: 0,
      h: 0,
    }

    this.id = ++id

    bind(['move', 'stop', 'start'], this)

    this.started = false

    resizer.add('mouse-element-' + this.id, 'resize', this, true)
  }

  start() {
    if(this.started) return;

    Loop.add('mouse-element-' + this.id, 'tick', this)
    this.currentMedia.target.classList.add('entered')
    this.enter.v = 1

    this.started = true
  }

  stop() {
    Loop.removeAfterDelay('mouse-element-' + this.id)
    this.currentMedia.target.classList.remove('entered')
    this.enter.v = 0

    if(this.currentMedia.resetOnLeave) {
      this.setMouse(this.size.w / 2, this.size.h / 2)
    }

    this.started = false
  }

  move(e) {
    const rect = this.node.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    this.setMouse(x, y)
  }

  listen() {
    this.removeEnterListeners = on(this.node, 'mouseenter', this.start)
    this.removeMoveListeners = on(this.node, 'mousemove', this.move)
    this.removeLeaveListeners = on(this.node, 'mouseleave', this.stop)
  }

  setMouse(x, y) {
    if(this.currentMedia.fromCenter) {
      this.mouse.x = x / this.size.w * 2 - 1
      this.mouse.y = (y / this.size.h * 2 - 1) * -1
    } else {
      this.mouse.x = x / this.size.w
      this.mouse.y = y / this.size.h
    }
  }

  resize() {
    super.resize()
    this.size.w = this.node.offsetWidth
    this.size.h = this.node.offsetHeight
  }

  unlisten() {
    this.removeEnterListeners && this.removeEnterListeners()
    this.removeLeaveListeners && this.removeLeaveListeners()
    this.removeMoveListeners && this.removeMoveListeners()

    this.removeEnterListeners = null
    this.removeLeaveListeners = null
    this.removeMoveListeners = null
  }

  $applyNewMedia() {
    if(!this.removeEnterListeners) {
      this.setStyle(0, 0, 0)
      this.listen()
    }
  }

  $disable() {
    this.unlisten()
    this.currentMedia.target.style.removeProperty('--mouse-x')
    this.currentMedia.target.style.removeProperty('--mouse-y')
    this.currentMedia.target.style.removeProperty('--mouse-enter')
  }

  setStyle(x = this.mouse.ix, y = this.mouse.iy, e = this.enter.iv) {
    if(!this.currentMedia.notify) return;
    this.currentMedia.target.style.setProperty('--mouse-x', x)
    this.currentMedia.target.style.setProperty('--mouse-y', y)
    this.currentMedia.target.style.setProperty('--mouse-enter', e)
  }

  tick() {
    this.mouse.ix = +lerp(this.mouse.ix, this.mouse.x, this.currentMedia.ease).toFixed(5)
    this.mouse.iy = +lerp(this.mouse.iy, this.mouse.y, this.currentMedia.ease).toFixed(5)
    this.enter.iv = +lerp(this.enter.iv, this.enter.v, this.currentMedia.ease).toFixed(5)
    this.setStyle()
  }
}

export function findAllMouseElements() {
  return [...document.querySelectorAll('[data-mouse-element]')].map(node => new MouseElement(node))
}