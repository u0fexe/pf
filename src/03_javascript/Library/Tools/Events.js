export default class Events {
  constructor(...events) {
    this.available = {}
    events.forEach(event => this.available[event] = [])
  }

  addEvents(...eventNames) {
    eventNames.forEach(n => this.available[n] = [])
  }

  addListener(event, cb) {
    if(!this.available[event]) return console.error(`event: ${event} is not available`)
    this.available[event].push(cb)
  }

  removeListener(event, cb) {
    if(!this.available[event]) return console.error(`event: ${event} is not available`)

    for(let i = this.available[event].length - 1; i >= 0; i--) {
      const mcb = this.available[event][i]
      if(mcb === cb) this.available[event].splice(i, 1)
    }

  }

  notify(event, ...args) {
    this.available[event].forEach(cb => cb(...args))
  }
}