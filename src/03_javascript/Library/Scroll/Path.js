import Loop from "../Tools/Loop.js"
import Events from "../Tools/Events.js"
import clamp from "../Utils/clamp.js"
import lerp from "../Utils/lerp.js"

import force from './Force.js'
import Part from "./Part.js"

export default class Path extends Part {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-path'), {
      varName: '--path',
    })

    this.inView = false

    this.events = new Events(
      'in',
      'out',
      'progress',
    )

    this.progressValue = {
      current: 0,
      interpolated: 0,
      currentN: 0,
      interpolatedN: 0,
    }
  }

  $applyNewMedia() {
    super.$applyNewMedia()

    if(this.currentMedia.target) {
      setTimeout(() => this.progress(), 0)
    }
  }

  $disable() {
    super.$disable()

    this.previousMedia && this.previousMedia.target && this.previousMedia.target.style.removeProperty(this.previousMedia.varName)
    Loop.remove('path' + this.id)
  }

  in() {
    if(this.inView) return;
    this.inView = true

    this.events.notify('in')

    if(this.currentMedia.target) {
      Loop.add('path' + this.id, 'progress', this)
    }
  }

  out(fastCheck) {
    if(!fastCheck && !this.inView) return;
    this.inView = false

    if(this.currentMedia.target) {
      Loop.add('path' + this.id, 'progress', this)
      Loop.removeAfterDelay('path' + this.id)
    }
    this.events.notify('out')
  }

  check(fastCheck) {
    if(this.currentMedia.disabled) return;

    if(force.scrollValue[this.currentMedia.scrollValueType] >= this.orientationBox.start && force.scrollValue[this.currentMedia.scrollValueType] <= this.orientationBox.end) {
      this.in()
    } else {
      this.out(fastCheck)
    }
  }

  progress() {
    this.progressValue.current = clamp(force.scrollValue[this.currentMedia.scrollValueType] - this.orientationBox.start, this.orientationBox.length)
    this.progressValue.currentN = this.progressValue.current / this.orientationBox.length

    this.progressValue.interpolated = +lerp(this.progressValue.interpolated, this.progressValue.current, this.currentMedia.ease || force.instance.currentMedia.ease).toFixed(5)
    this.progressValue.interpolatedN = this.progressValue.interpolated / this.orientationBox.length

    this.currentMedia.target.style.setProperty(this.currentMedia.varName, this.progressValue.interpolatedN)
    this.events.notify('progress', this.progressValue, this.currentMedia.CSSVars)
  }
}
