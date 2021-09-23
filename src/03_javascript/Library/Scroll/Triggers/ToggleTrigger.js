import force from '../Force.js'
import Trigger from "./Trigger.js"

export default class ToggleTrigger extends Trigger {
  constructor(id, node, name, settings = {}) {
    super(id, node, name, {
      extraLength: 1,
      offset: -1,
      once: false,
      property: false,
      ...settings
    })

    this.timeout = null

    this.checkInLoop = this.checkInLoop.bind(this)
  }

  $applyNewMedia() {
    super.$applyNewMedia()
  }

  $disable() {
    super.$disable()
  }

  in() {
    super.in()
    force.events.removeListener('update', this.checkInLoop)
  }

  checkInLoop() {
    const scrollValue = force.instance.currentMedia.smooth ? force.scrollValue.stopsDependentInterpolated : force.scrollValue.stopsDependent

    if(scrollValue > this.orientationBox.end && force.scrollValue.stopsDependent > this.orientationBox.start && !this.permanent) {
      !this.currentMedia.keep && this.outChecked && this.outChecked()
      this.afterEnd && this.afterEnd()
      force.events.removeListener('update', this.checkInLoop)
    }

    else if(scrollValue < this.orientationBox.start && !this.permanent && !this.keep) {
      this.outChecked && this.outChecked()
      this.beforeStart && this.beforeStart()
      force.events.removeListener('update', this.checkInLoop)
    }
  }

  out() {
    super.out()
    if(force.instance.currentMedia.smooth) {
      force.events.addListener('update', this.checkInLoop)
    } else {
      this.checkInLoop()
    }
  }
}
