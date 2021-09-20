import force from "../Force.js"
import model from "../Model.js"
import on from "../../Utils/on.js"

export default class Drag {
  constructor() {
    this.dragListeners = null
    this.anyDirection = false
  }

  listen() {
    this.dragListeners = on(window, 'touchstart mousedown', this.grab.bind(this))
  }

  unlisten() {
    this.dragListeners && this.dragListeners()
  }

  grab(e) {
    if(model.checkPrevents(e.target)) return;
    const touch = e.type === 'touchstart'
    if(e.target.tagName === 'IMG') e.preventDefault()

    document.documentElement.classList.add('grabbing')

    const startScrollValue = force.scrollValue.current

    let startTouchValue = 0
    startTouchValue = { x: touch ? e.touches[0].clientX : e.clientX, y: touch ? e.touches[0].clientY : e.clientY }

    const move = (e) => {
      if(e.cancelable) e.preventDefault()
      const currentTouchValue = { x: touch ? e.touches[0].clientX : e.clientX, y: touch ? e.touches[0].clientY : e.clientY }
      const dx = startTouchValue.x - currentTouchValue.x
      const dy = startTouchValue.y - currentTouchValue.y
      const max = Math.abs(dx) > Math.abs(dy) ? dx : dy
      const sign = Math.sign(max)
      const delta = Math.sqrt(dx * dx + dy * dy) * sign * model.instance.currentMedia.reverse
      const diff = Math.abs(delta) / model.screenSize
      const acceleration = 1 + (diff * model.instance.currentMedia.dragAcceleration)
      const value = startScrollValue + delta * force.instance.currentMedia.speedMultiplier * acceleration
      force.set(value)
    }

    const end = () => {
      document.documentElement.classList.remove('grabbing')
      removeMoveListeners()
      removeEndListeners()
    }

    const removeMoveListeners = on(window, 'mousemove touchmove', move, { passive: false })
    const removeEndListeners = on(window, 'mouseup touchend', end)
  }
}