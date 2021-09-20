import PropertyTrigger from "./PropertyTrigger.js"

export default class ClassTrigger extends PropertyTrigger {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-class-trigger'))
  }

  $applyNewMedia() {
    super.$applyNewMedia()

    if(!this.currentMedia.data) {
      this.currentMedia.data = 'in-view'
    }
  }

  $disable() {
    super.$disable()

    if(this.previousMedia.data) {
      this.previousMedia.target.classList.remove(this.previousMedia.data)
    }
  }

  in() {
    super.in()
    this.currentMedia.target.classList.add(this.currentMedia.data)
  }

  outChecked() {
    super.outChecked()
    this.currentMedia.target.classList.remove(this.currentMedia.data)
  }
}
