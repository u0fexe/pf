import Button from './Button.js'

export default class Item extends Button {
  constructor(node, storage, index) {
    super(node, storage, index, 'itemButton')

    if(!node) return;
  }

  clearDom() {
    this.node.classList.remove("prev")
    this.node.classList.remove("current")
    this.node.classList.remove("next")
  }

  prev() {
    this.node.classList.add('prev')
  }

  next() {
    this.node.classList.add('next')
  }

  current() {
    this.node.classList.add('current')
  }
}