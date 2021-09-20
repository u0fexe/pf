import model from "../Model.js"
import force from "../Force.js"
import on from "../../Utils/on.js"
import clamp from "../../Utils/clamp.js"
import bind from "../../Utils/bind.js"

export default class Scrollbar {
  constructor() {
    this.bar = null
    this.knob = null
    this.removeGrabListeners = null

    this.partsFound = false
    this.findParts()
    if(!this.partsFound) return;

    bind('grab', this)

    this.isVertical = false
    this.length = 0
  }

  findParts() {
    this.bar = document.querySelector('[data-scrollbar]')
    this.knob = document.querySelector('[data-scrollbar-knob]')

    if(this.bar && this.knob) {
      this.partsFound = true
      model.prevents.push(this.bar)
    }
  }

  listen() {
    if(!this.partsFound) return;
    this.removeGrabListeners = on(this.knob, 'mousedown touchstart', this.grab, {passive: false})
  }

  unlisten() {
    if(!this.partsFound || !this.removeGrabListeners) return;
    this.removeGrabListeners()
  }

  grab(e) {
    e.preventDefault()
    const touch = e.type === 'touchstart'

    const startValue = force.scrollValue.current / model.scrollLengthWithStops * this.length
    let startTouchValue = 0

    document.documentElement.classList.add('grabbing')

    if(this.isVertical) {
      startTouchValue = touch ? e.touches[0].clientY : e.clientY
    } else {
      startTouchValue = touch ? e.touches[0].clientX : e.clientX
    }

    const move = (e) => {
      let currentTouchValue = 0

      if(this.isVertical) {
        currentTouchValue = touch ? e.touches[0].clientY : e.clientY
      } else {
        currentTouchValue = touch ? e.touches[0].clientX : e.clientX
      }

      const delta = currentTouchValue - startTouchValue
      const value = clamp(startValue + delta, this.length)
      force.set(value / this.length * model.scrollLengthWithStops)
    }

    const end = () => {
      removeMoveListeners()
      removeEndListeners()
      document.documentElement.classList.remove('grabbing')
    }

    const removeMoveListeners = on(window, 'mousemove touchmove', move)
    const removeEndListeners = on(window, 'mouseup touchend', end)
  }

  resize() {
    if(!this.partsFound) return;
    this.isVertical = this.bar.offsetHeight > this.bar.offsetWidth

    const barMax = Math.max(this.bar.offsetHeight, this.bar.offsetWidth)
    const knobMax = Math.max(this.knob.offsetHeight, this.knob.offsetWidth)

    this.length = barMax === knobMax ? barMax : barMax - knobMax
  }
}