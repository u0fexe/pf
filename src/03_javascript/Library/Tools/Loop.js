import bind from "../Utils/bind.js"

export class Loop {
  constructor() {
    this.frameId = null
    this.updatable = {}
    this.length = 0

    this.update = this.update.bind(this)
    this.removeTimeouts = {}
  }

  update(t) {
    for (const member in this.updatable) this.updatable[member](t)
    this.length > 0 && (this.frameId = requestAnimationFrame(this.update))
  }

  add(name, callback, bindTo, checkFirst) {

    if(checkFirst && this.updatable[name]) return;

    if(typeof callback === 'string' && bindTo) {
      bind(callback, bindTo)
      this.updatable[name] = bindTo[callback]
    } else {
      this.updatable[name] = callback
    }

    if(this.removeTimeouts[name]) {
      clearTimeout(this.removeTimeouts[name])
    }

    if (this.length === 0) {
      this.length++
      this.run()
      return
    }

    this.length++
  }

  remove(name) {
    if (!this.updatable[name]) return

    delete this.updatable[name]
    this.length = Math.max(0, this.length - 1)
    if (this.length === 0) this.stop()
  }

  removeAfterDelay(name, cb, delay = 2000) {
    this.removeTimeouts[name] = setTimeout(() => {
      this.remove(name)
      cb && cb()
      delete this.removeTimeouts[name]
    }, delay)
  }

  run() {
    this.stop()
    this.frameId = requestAnimationFrame(this.update)
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }
}

const loop = new Loop()

export default loop