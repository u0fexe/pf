import throttle from "../../Utils/throttle.js"
import clamp from "../../Utils/clamp.js"
import lerp from "../../Utils/lerp.js"
import bind from "../../Utils/bind.js"
import Loop from "../../Tools/Loop.js"
import force from "../Force.js"
import model from "../Model.js"

export default class Wheel {
  listen() {
    bind(['wheel', 'updateWheel'], this)
    this.wheelCallback = throttle(this.wheel, 20)

    this.wheelValue = {
      current: 0,
      interpolated: 0,
      delta: 0
    }
    addEventListener('wheel', this.wheelCallback)
  }

  unlisten() {
    removeEventListener('wheel', this.wheelCallback)
  }

  wheel(e) {
    if(model.checkPrevents(e.target)) return;

    if(force.instance.currentMedia.smoothWheel) {
      Loop.add('wheel', this.updateWheel, null, true)
      this.wheelValue.delta = Math.abs(e.deltaY)
      this.wheelValue.current = clamp(e.deltaY, 1, -1) * model.instance.currentMedia.reverse
    } else {
      force.add(Math.min(e.deltaY, 100))
    }
  }

  updateWheel() {
    this.wheelValue.current *= 0.7
    this.wheelValue.current = this.wheelValue.current
    this.wheelValue.interpolated = lerp(this.wheelValue.interpolated, this.wheelValue.current, 0.1)
    const value = Math.abs(this.wheelValue.interpolated) * (this.wheelValue.delta * this.wheelValue.interpolated)
    force.add(value)

    if(this.wheelValue.current.toFixed(5) === this.wheelValue.interpolated.toFixed(5)) {
      Loop.remove('wheel')
      this.wheelValue.current = this.wheelValue.interpolated = 0
    }
  }
}