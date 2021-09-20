import lerp from '../Utils/lerp.js'
import clamp from '../Utils/clamp.js'
import bind from '../Utils/bind.js'
import on from '../Utils/on.js'

import loop from '../Tools/Loop.js'

export default class Content {
  constructor(node, storage) {
    if(!node) return;

    bind(['drag', 'tick'], this)

    this.node = node
    this.storage = storage

    this.dragValue = {
      current: 0,
      interpolated: 0,
      normalized: 0,
    }

    this.dragSettings = {
      vertical: null,
      size: null,
      step: null,
      timeout: null,
      id: 'counter_content_drag' + this.storage.id
    }
  }

  resize() {
    const rect = this.node.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height

    if(this.storage.currentMedia.drag) {
      this.dragSettings.vertical = this.storage.currentMedia.drag === 'y'
      this.dragSettings.size = this.dragSettings.vertical ? this.height : this.width
      this.dragSettings.max = Math.abs(this.dragSettings.size - ( this.dragSettings.vertical ?  this.storage.viewport.height : this.storage.viewport.width))
      this.dragSettings.step = this.dragSettings.max / this.storage.items.lengthm1

      if(!this.dragSettings.max) {
        console.warn(this.node, 'content and viewport are the same size')
      }
    }
  }

  unlistenDrag() {
    this.storage.activeEvents.drag()
    this.resetDrag()
  }

  listenDrag() {
    this.storage.activeEvents.drag = on(this.node, 'mousedown touchstart', this.drag)
  }

  resetDrag() {
    loop.remove(this.dragSettings.id)
    this.dragValue.current = 0
    this.dragValue.interpolated = 0
    this.dragValue.normalized = 0
  }

  updateDomVariables(d, dn) {
    this.storage.currentMedia.target.style.setProperty('--drag', d.toFixed(5)  + 'px')
    this.storage.currentMedia.target.style.setProperty('--drag-normalized', dn.toFixed(5))
  }

  tick() {
    this.dragValue.interpolated = lerp(this.dragValue.interpolated, this.dragValue.current, this.storage.currentMedia.dragEase)
    this.dragValue.normalized = this.dragValue.interpolated / this.dragSettings.max
    this.updateDomVariables(-this.dragValue.interpolated, this.dragValue.normalized)
  }

  setDragValue(addValue, initialValue = this.dragValue.current) {
    this.dragValue.current = clamp(initialValue + addValue, this.dragSettings.max)
  }

  startLoop(prepareEnd = false) {
    loop.add(this.dragSettings.id, this.tick)

    if(prepareEnd) loop.removeAfterDelay(this.dragSettings.id)
  }

  stopLoop() {
    loop.removeAfterDelay(this.dragSettings.id)
  }

  convertDragValueToCounter() {
    if(!this.storage.currentMedia.convertDragToCounter) return;
    const value = Math.round((this.dragValue.current) / this.dragSettings.step)
    this.storage.counter = value
  }

  convertNumberToDragValue(value) {
    this.setDragValue(value * this.dragSettings.step, 0)
  }

  snap() {
    if(!this.storage.currentMedia.snap) return;

    let snapTo = 0

    this.storage.items.items.forEach((item, i, currentArray) => {
      const currentItemStart = this.dragSettings.vertical ? item.node.offsetTop : item.node.offsetLeft
      let nextItemStart = 0

      const nextItem = currentArray[i + 1]

      if(nextItem) {
        nextItemStart =  this.dragSettings.vertical ? nextItem.node.offsetTop : nextItem.node.offsetLeft
      }

      if(this.dragValue.current > currentItemStart && this.dragValue.current <= nextItemStart) {
        const delta = nextItemStart - currentItemStart
        const middle = delta / 2
        const check = this.dragValue.current > currentItemStart + middle
        const last = Math.round((this.dragValue.current) / this.dragSettings.step) === this.storage.items.lengthm1
        snapTo = !check && !last ? currentItemStart : nextItemStart
      }
    })

    this.setDragValue(snapTo, 0)
  }

  drag(e) {
    const touch = e.type === 'touchstart'
    if(!touch) e.preventDefault()
    this.startLoop()

    const initialValue = this.dragValue.current
    let grabValue = 0
    let moveValue = 0
    let moved = false

    if(this.dragSettings.vertical) {
      grabValue = touch ? e.touches[0].clientY : e.clientY
    } else {
      grabValue = touch ? e.touches[0].clientX : e.clientX
    }

    const events = {
      move: null,
      stop: null,
    }

    document.documentElement.classList.add('grabbing')

    const move = (e) => {

      if(this.dragSettings.vertical) {
        moveValue = touch ? e.touches[0].clientY : e.clientY
      } else {
        moveValue = touch ? e.touches[0].clientX : e.clientX
      }

      const delta = (grabValue - moveValue) * this.storage.currentMedia.dragSpeedMultiplier
      moved = Math.abs(delta) > 10

      if(moved && e.cancelable) {
        this.setDragValue(delta, initialValue)
        this.convertDragValueToCounter()
        e.preventDefault()
      }
    }

    const stop = () => {
      document.documentElement.classList.remove('grabbing')
      events.stop()
      events.move()
      this.stopLoop()
      if(moved) this.snap()
    }

    events.move = on(window, 'mousemove touchmove', move, { passive: false })
    events.stop = on(window, 'mouseup touchend', stop)
  }
}