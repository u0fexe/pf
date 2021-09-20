import clamp from '../Utils/clamp.js'
import lerp from "../Utils/lerp.js"
import debounce from "../Utils/debounce.js"
import Events from '../Tools/Events.js'
import model from './Model.js'

class Force {
  constructor() {
    this.instance = null

    this.firstMove = false

    this.scrollValue = {
      current: 0,
      previous: 0,
      currentN: 0,
      interpolated: 0,
      interpolatedN: 0,
      stopsDependentInterpolated: 0,
      stopsDependent: 0,
    }

    this.stopSnapEase = 0.1
    this.speed = 0
    this.direction = {
      current: 0,
      interpolated: 0,
    }

    this.events = new Events(
      'add',
      'update',
    )

    this.show()
  }

  add(value, speed = this.instance.currentMedia.speedMultiplier, ignoreStops = false) {
    const newValue = this.scrollValue.current + value * speed
    this.scrollValue.current = clamp(newValue, model.scrollLengthWithStops)
    this.scrollValue.currentN = this.scrollValue.current / model.scrollLengthWithStops

    if(this.instance.currentMedia.smooth) {
      model.checkStops()
    }

    if(model.activeStop && !ignoreStops) {
      this.scrollValue.stopsDependent = model.activeStop.orientationBox.start - model.passedStopsLength
    } else {
      this.scrollValue.stopsDependent = this.scrollValue.current - model.passedStopsLength
    }
    model.checkPaths()
    model.checkTriggers()

    if(this.instance.currentMedia.progressVar && !this.instance.currentMedia.smooth) {
      this.instance.node.style.setProperty('--scroll-progress', this.scrollValue.currentN)
    }

    this.show()

    this.events.notify('add', { clearValue: value, deformedValue: newValue, scrollValue: this.scrollValue })

    if(this.scrollValue.previous <= this.scrollValue.current && this.scrollValue.currentN !== 1) {
      document.documentElement.classList.add('scrolling-forward')
      document.documentElement.classList.remove('scrolling-backward')
      this.direction.current = 1

    }

    else if(this.scrollValue.previous >= this.scrollValue.current && this.scrollValue.currentN !== 0) {
      document.documentElement.classList.add('scrolling-backward')
      document.documentElement.classList.remove('scrolling-forward')
      this.direction.current = -1
    }

    model.checkSections()

    this.scrollValue.previous = this.scrollValue.current
  }

  show() {
    const hide = debounce(() => document.documentElement.classList.remove('scrolling'), 2000)
    this.show = () => {
      if(this.scrollValue.current === 0 || this.scrollValue.current === model.scrollLengthWithStops) return;
      document.documentElement.classList.add('scrolling')
      hide()
    }
  }

  set(value, fastCheck, navigate) {

    this.scrollValue.current = 0
    this.add(value, 1)

    if(fastCheck) {

      if(this.instance.currentMedia.smooth) {
        model.checkStops(true)
      }

      model.checkPaths(true)

      this.scrollValue.current = 0
      this.add(value, 1)
    }

    if(navigate) {
      this.instance.node.scrollTo(this.instance.currentMedia.type === 'vertical' ? 0 : value, this.instance.currentMedia.type === 'horisontal' ? 0 : value)
    }
  }

  resize() {
    this.set(this.scrollValue.currentN * model.scrollLengthWithStops, true)
    this.stopSnapEase = this.instance.currentMedia.stopSnapEase ? this.instance.currentMedia.stopSnapEase : this.instance.currentMedia.ease
  }

  reset() {
    this.scrollValue.current = 0
    this.scrollValue.currentN = 0
    this.scrollValue.interpolated = 0
    this.scrollValue.interpolatedN = 0
    this.scrollValue.stopsDependentInterpolated = 0
    this.scrollValue.stopsDependent = 0
  }

  update() {
    this.scrollValue.interpolated = +lerp(this.scrollValue.interpolated, this.scrollValue.current, this.instance.currentMedia.ease).toFixed(5)
    this.scrollValue.stopsDependentInterpolated = +lerp(this.scrollValue.stopsDependentInterpolated, this.scrollValue.stopsDependent, model.activeStop ? this.stopSnapEase : this.instance.currentMedia.ease).toFixed(5)
    this.scrollValue.interpolatedN = +(this.scrollValue.interpolated / model.scrollLengthWithStops).toFixed(5)
    this.direction.interpolated = +lerp(this.direction.interpolated, this.direction.current, 0.1).toFixed(5)

    const rush = Math.min(Math.abs(this.scrollValue.current - this.scrollValue.interpolated), this.instance.currentMedia.speedDistance) / this.instance.currentMedia.speedDistance
    this.speed += (rush - this.speed) * this.instance.currentMedia.speedEase
    this.speed = +this.speed.toFixed(5)

    if(this.instance.currentMedia.progressVar) {
      this.instance.node.style.setProperty('--scroll-progress', this.scrollValue.interpolatedN)
    }

    if(this.instance.currentMedia.speedVar) {
      this.instance.node.style.setProperty('--scroll-speed', this.speed)
    }

    this.events.notify('update', this.scrollValue)
  }
}

const force = new Force()
export default force