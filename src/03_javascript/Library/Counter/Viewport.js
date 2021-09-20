import bind from '../Utils/bind.js'
import throttle from '../Utils/throttle.js'
import clamp from '../Utils/clamp.js'
import on from '../Utils/on.js'
import cache from '../Tools/Cache.js'

export default class Viewport {
  constructor(node, storage) {
    if(!node) return;

    bind(['wheel', 'swipe', 'checkWheelFinish'], this)

    this.node = node
    this.storage = storage
    this.width = 0
    this.height = 0

    this.swipeSettings = {
      vertical: null,
      size: null,
      step: null,
    }
  }

  resize() {
    const rect = this.node.getBoundingClientRect()
    this.width = rect.width
    this.height = rect.height
    this.maxSide = Math.max(this.width, this.height)

    if(this.storage.currentMedia.swipe) {
      this.swipeSettings.vertical = this.storage.currentMedia.swipe === 'y'
      this.swipeSettings.size = this.swipeSettings.vertical ? this.height : this.width
      this.swipeSettings.step = this.swipeSettings.size / this.storage.currentMedia.splitScreen
    }
  }

  unlistenWheel() {
    this.storage.activeEvents.wheel()
  }

  listenWheel() {
    this.storage.activeEvents.wheel = on(this.node, 'wheel', throttle(this.wheel, this.storage.currentMedia.throttle, this.checkWheelFinish))
  }

  checkWheelFinish(e) {
    if(this.storage.currentMedia.drag && this.storage.content) {
      if(
        this.storage.content.dragValue.current + e.deltaY <= this.storage.content.dragSettings.size - this.maxSide &&
        this.storage.content.dragValue.current + e.deltaY >= 0
      ) e.preventDefault()
    }

    else {
      const direction = clamp(e.deltaY, 1, -1)
      if(
        this.storage.counter + direction <= this.storage.items.max &&
        this.storage.counter + direction >= 0
      ) e.preventDefault()
    }
  }

  cropViewport(e) {
    const element = cache.findElement(this.storage.currentMedia.viewportWidthCrop)
    if(element) {
      const viewportRect = this.node.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const mouseX = e.clientX - viewportRect.left
      const crop = elementRect.width
      if(mouseX > crop) return false;
    }

    return true
  }

  wheel(e) {
    if(this.storage.currentMedia.viewportWidthCrop && !this.cropViewport(e)) return;

    if(this.storage.currentMedia.drag && this.storage.content) {
      this.storage.content.startLoop(true)
      this.storage.content.setDragValue(e.deltaY)
      this.storage.content.convertDragValueToCounter()
    } else {
      const direction = clamp(e.deltaY, 1, -1)
      this.storage.counter = this.storage.counter + direction
    }
  }

  unlistenSwipe() {
    this.storage.activeEvents.swipe()
  }

  listenSwipe() {
    this.storage.activeEvents.swipe = on(this.node, 'mousedown touchstart', this.swipe)
  }

  swipe(e) {
    const touch = e.type === 'touchstart'
    if(!touch) e.preventDefault()
    document.documentElement.classList.add('grabbing')

    let grabValue = 0
    let moveValue = 0
    let currentValue = 0
    let prevValue = 0

    if(this.swipeSettings.vertical) {
      grabValue = touch ? e.touches[0].clientY : e.clientY
    } else {
      grabValue = touch ? e.touches[0].clientX : e.clientX
    }

    const events = {
      move: null,
      stop: null,
    }

    const move = (e) => {
      if(this.swipeSettings.vertical) {
        moveValue = touch ? e.touches[0].clientY : e.clientY
      } else {
        moveValue = touch ? e.touches[0].clientX : e.clientX
      }

      const delta = grabValue - moveValue

      if(Math.abs(delta) > this.swipeSettings.size * 0.05 && e.cancelable) {
        e.preventDefault()

        currentValue = delta / this.swipeSettings.step
        currentValue = currentValue >= 0 ? Math.ceil(currentValue) : Math.floor(currentValue)

        if (prevValue !== currentValue) {
          const readyStep = clamp(currentValue, 1, -1) * this.storage.currentMedia.step
          this.storage.counter = this.storage.counter + readyStep
          prevValue = currentValue
        }
      }

    }

    const stop = (e) => {
      document.documentElement.classList.remove('grabbing')
      events.stop()
      events.move()
    }

    events.move = on(window, 'mousemove touchmove', move, { passive: false })
    events.stop = on(window, 'mouseup touchend', stop)
  }
}