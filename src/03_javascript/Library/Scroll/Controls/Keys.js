import force from "../Force.js"
import model from "../Model.js"

export default class Keys {
  constructor() {
  }

  listen() {
    addEventListener('keydown', this.keys)
  }

  unlisten() {
    removeEventListener('keydown', this.keys)
  }

  keys(e) {
    if(e.key === ' ') {
      if(e.shiftKey) force.add(-force.instance.currentMedia.spaceValue)
      else force.add(force.instance.currentMedia.spaceValue)
    }

    else if(e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
      force.add(force.instance.currentMedia.arrowsValue * model.instance.currentMedia.reverse)
    }

    else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
      force.add(-force.instance.currentMedia.arrowsValue * model.instance.currentMedia.reverse)
    }

    else if(e.key === 'Home') {
      force.set(0, true)
    }

    else if(e.key === 'End') {
      force.set(model.scrollLengthWithStops, true)
    }
  }
}