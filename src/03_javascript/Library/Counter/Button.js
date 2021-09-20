import bind from '../Utils/bind.js'
import on from '../Utils/on.js'
import throttle from '../Utils/throttle.js'

export default class Button {
  constructor(node, storage, index = 1, type = 'numberButton') {
    if(!node) return;

    bind(['setCounter'], this)

    this.node = node
    this.type = type
    this.storage = storage
    this.index = index
    this.value = parseInt(this.node.getAttribute('data-value')) || index
  }

  applyNewMedia() {
    if(Math.abs(this.value) === 1) {
      this.value = this.value * this.storage.currentMedia.step
    }
  }

  unlisten() {
    this.storage.activeEvents[this.type].forEach(e => e())
  }

  listen() {
    this.storage.activeEvents[this.type].push(on(this.node, 'click', throttle(this.setCounter, this.storage.currentMedia.throttle)))
  }

  convertToDragValue(value, base = 0) {
    if(this.storage.currentMedia.dragAvailable) {
      this.storage.content.startLoop()
      this.storage.counter = base + value
      this.storage.content.convertNumberToDragValue(this.storage.counter)
    }
  }

  setCounter() {
    if(this.storage.currentMedia.dragAvailable && this.storage.currentMedia.convertCounterToDrug) {
      this.convertToDragValue(this.value)
    } else {
      this.storage.counter = this.value
    }
  }

  current(counterValue) {
    if(counterValue === this.value) this.node.classList.add('current')
    else this.blank()
  }

  blank() {
    this.node.classList.remove('current')
  }
}