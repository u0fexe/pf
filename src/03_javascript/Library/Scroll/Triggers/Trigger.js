import Events from "../../Tools/Events.js"
import force from '../Force.js'
import Part from "../Part.js"

export default class Trigger extends Part {
  constructor(id, node, name, defaultAttributes) {
    super(id, node, name, defaultAttributes)

    this.inView = false

    this.events = new Events(
      'in',
      'out',
    )
  }

  $applyNewMedia() {
    super.$applyNewMedia()
    this.inView = false
    setTimeout(() => this.check(), 0)
  }

  $disable() {
    super.$disable()
    this.inView = false
  }

  in() {
    this.inView = true
    this.events.notify('in')
  }

  out() {
    this.inView = false
    this.events.notify('out')
  }

  check() {
    if(this.currentMedia.disabled) return;


    const inView = (
      force.scrollValue[this.currentMedia.scrollValueType] >= this.orientationBox.start &&
      force.scrollValue[this.currentMedia.scrollValueType] <= this.orientationBox.end
    )

    if(inView && !this.inView) this.in()
    else if(!inView && this.inView) this.out()
  }
}
