import pad from '../Utils/pad.js'

export default class Items {
  constructor(items, storage) {
    if(!items.length) return;
    this.storage = storage

    this.items = items
    this.length = 0
    this.lengthm1 = 0
    this.lengthm2 = 0
    this.max = 0
  }

  applyNewMedia() {
    this.length = this.items.length - this.storage.currentMedia.lengthOffset
    this.lengthm1 = this.length - 1
    this.lengthm2 = this.length - 2
    this.max = this.length - this.storage.currentMedia.activeItems
  }

  clearDom() {
    this.items.forEach(item => item.clearDom())
  }

  notifyDom(counter = this.storage.counter) {
    this.clearDom()
    this.items.forEach((item, id) => {
      const min = counter
      const max = counter + (this.storage.currentMedia.activeItems || 1) - 1

      if (id < min) item.prev()
      else if (id > max) item.next()
      else item.current()
    })
  }

  showArrayInfo() {
    this.items.forEach((item, i) => {
      item.node.setAttribute('data-array-position', pad(i + 1, 2))
      item.node.setAttribute('data-array-length', this.storage.items.length)
    })
  }

  clearArrayInfo() {
    this.items.forEach((item, i) => {
      item.node.removeAttribute('data-array-position')
      item.node.removeAttribute('data-array-length')
    })
  }
}