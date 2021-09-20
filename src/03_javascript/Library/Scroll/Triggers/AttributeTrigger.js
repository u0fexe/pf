import PropertyTrigger from "./PropertyTrigger.js"

export default class AttributeTrigger extends PropertyTrigger {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-attribute-trigger'))
    this.propertyReady = false
  }

  $applyNewMedia() {
    super.$applyNewMedia()

    if(!this.currentMedia.data) {
      this.currentMedia.data = 'true'
    }

    if(!this.currentMedia.property) {
      this.currentMedia.property = 'data-in-view'
    }

    this.propertyReady = this.previousMedia.data && this.previousMedia.property
  }

  $disable() {
    super.$disable()

    if(this.propertyReady) {
      this.previousMedia.target.removeAttribute(this.previousMedia.property)
      this.propertyReady = false
    }
  }

  in() {
    super.in()
    this.currentMedia.target.setAttribute(this.currentMedia.property, this.currentMedia.data)
  }

  outChecked() {
    super.outChecked()
    this.currentMedia.target.removeAttribute(this.currentMedia.property)
  }
}
