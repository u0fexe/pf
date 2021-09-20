import clamp from '../Utils/clamp.js'
import pad from '../Utils/pad.js'

let counterId = 0

export default class Storage {
  constructor(events) {
    this.counterId = ++counterId

    this._counter = -1

    this.currentMedia = null
    this.previousMedia = null


    this.viewport = null
    this.content = null
    this.items = null
    this.stepButtons = null
    this.numberButtons = null
    this.disableButtons = []
    this.reloadButtons = []

    this.events = events

    this.activeEvents = {
      wheel: null,
      swipe: null,
      drag: null,
      stepButton: [],
      numberButton: [],
      itemButton: [],
    }
  }

  notifyDom() {
    const endOFfset = this.currentMedia.endOffset
    const counter = endOFfset ? clamp(this.counter, this.items.max - endOFfset) : this.counter
    const first = counter === 0
    const last = counter === this.items.max || this.items.length < this.currentMedia.activeItems

    if(this.currentMedia.counterVariable) {
      this.currentMedia.target.style.setProperty('--counter', counter)
    }

    if(this.currentMedia.counterAttribute) {
      this.currentMedia.target.setAttribute('data-counter', pad(counter + 1, 2))
    }

    if(this.currentMedia.itemsPositions) {
      this.items.notifyDom()
    }

    if(this.currentMedia.numberButtons) {
      this.numberButtons.forEach(button => button.current(this.counter))
    }

    if(this.currentMedia.firstLastVariables) {
      this.currentMedia.target.style.setProperty('--first', +first)
      this.currentMedia.target.style.setProperty('--last', +last)
    }

    if(this.currentMedia.firstLastAttributes) {
      this.currentMedia.target.setAttribute('data-first', first)
      this.currentMedia.target.setAttribute('data-last', last)
    }
  }

  notifyListeners() {
    this.events.notify('counterChange', this.counter)
  }

  loopCounter(newValue) {
    return newValue >= 0 ? newValue % (this.items.max + this.currentMedia.step) : (this.items.max - this.currentMedia.step) - newValue
  }

  clampCounter(newValue) {
    return clamp(newValue, this.items.max)
  }

  set counter(newValue) {
    if(newValue === this.counter) return;

    if(this.currentMedia.loop) {
      this._counter = this.loopCounter(newValue)
    } else {
      this._counter = this.clampCounter(newValue)
    }

    this.notifyDom()
    this.notifyListeners()
  }

  get counter() {
    return this._counter
  }
}