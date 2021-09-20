import debounce from "../Utils/debounce.js"
import bind from "../Utils/bind.js"

class Resizer {
  constructor() {
    this.callbacks = {}

    addEventListener('resize', debounce(this._resize.bind(this), 300))
  }

  add(name, callback, bindTo, callImmediately) {
    if(typeof callback === 'string' && bindTo) {
      bind(callback, bindTo)
      this.callbacks[name] = bindTo[callback]
    } else {
      this.callbacks[name] = callback
    }

    if(callImmediately) {
      this.callbacks[name]()
    }
  }

  remove(name) {
    delete this.callbacks[name]
  }

  _resize() {
    for (const member in this.callbacks) {
      this.callbacks[member]()
    }
  }
}

const resizer = new Resizer()
export default resizer