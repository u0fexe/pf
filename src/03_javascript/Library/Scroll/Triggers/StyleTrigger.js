import PropertyTrigger from "./PropertyTrigger.js"

export default class StyleTrigger extends PropertyTrigger {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-style-trigger'))
    this.propertyReady = false
  }

  $applyNewMedia() {
    super.$applyNewMedia()

    if(!this.currentMedia.data) {
      this.currentMedia.data = '1'
    }

    if(!this.currentMedia.property) {
      this.currentMedia.property = '--in-view'
    }

    this.propertyReady = this.previousMedia.data && this.previousMedia.property
  }

  $disable() {
    super.$disable()

    if(this.propertyReady) {
      this.previousMedia.target.style.removeProperty(this.previousMedia.property)
      this.propertyReady = false
    }
  }

  in() {
    super.in()
    this.currentMedia.target.style.setProperty(this.currentMedia.property, this.currentMedia.data)
  }

  outChecked() {
    super.outChecked()
    this.currentMedia.target.style.removeProperty(this.currentMedia.property)
  }
}
