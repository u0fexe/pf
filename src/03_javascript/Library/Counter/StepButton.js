import Button from './Button.js'

export default class StepButton extends Button {
  constructor(node, storage, index) {
    super(node, storage, index, 'stepButton')
    if(!this.node) return;
  }

  setCounter() {
    if(this.storage.currentMedia.dragAvailable) {
      this.convertToDragValue(this.value, this.storage.counter)
    } else {
      this.storage.counter = this.storage.counter + this.value
    }
  }
}