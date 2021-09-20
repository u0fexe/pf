import DeviceDependent from "../Tools/DeviceDependent.js"
import model from './Model.js'

export default class Part extends DeviceDependent {
  constructor(id, node, name, defaultOptions = {}) {
    super(node, {
      offset: 0,
      align: 0,
      offsetFrom: {element: null, mult: 1},
      lengthMultiplier: 1,
      extraLength: 0,
      scrollValueType: 'stopsDependent',
      ...defaultOptions
    })

    this.id = id
    this.name = name

    this.used = false

    this.orientationBox = {
      start: 0,
      length: 0,
      end: 0,
    }

    this.box = model.createBox(node, name, this)
  }

  $applyNewMedia() {
    this.used = true
  }

  $disable() {
    // this.box.clear()

    this.orientationBox = {
      start: 0,
      length: 0,
      end: 0,
    }
  }

  resize(previousValue = 0) {
    super.resize()

    if(this.currentMedia.disabled) return;


    const isVertical = model.instance.currentMedia.type === 'vertical'
    const targetSize = isVertical ? this.box.height : this.box.width

    this.orientationBox.align = this.currentMedia.align ? this.currentMedia.align * (model.screenSize - targetSize) : 0
    this.orientationBox.offsetFrom =
    this.currentMedia.offsetFrom.element ?
    (isVertical && this.currentMedia.offsetFrom.element.offsetHeight || this.currentMedia.offsetFrom.element.offsetWidth) * this.currentMedia.offsetFrom.mult : 0
    this.orientationBox.offset = this.currentMedia.offset * model.screenSize

    this.orientationBox.resOffset = this.currentMedia.offset * model.screenSize + this.orientationBox.offsetFrom - this.orientationBox.align

    if(model.instance.currentMedia.type === 'vertical') {
      this.orientationBox.length = this.currentMedia.lengthMultiplier * this.box.height + this.currentMedia.extraLength * model.screenSize
      this.orientationBox.start = this.box.top + this.orientationBox.resOffset + previousValue
      this.orientationBox.end = this.orientationBox.start + this.orientationBox.length
    } else {
      this.orientationBox.length = this.currentMedia.lengthMultiplier * this.box.width + this.currentMedia.extraLength * model.screenSize
      this.orientationBox.start = this.box.left + this.orientationBox.resOffset + previousValue
      this.orientationBox.end = this.orientationBox.start + this.orientationBox.length
    }

    this.orientationBox.start = Math.max(0,  this.orientationBox.start)
    this.orientationBox.end   = Math.max(0,  this.orientationBox.end)
  }
}