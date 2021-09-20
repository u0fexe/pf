import force from "../Force.js"
import model from "../Model.js"
import DeviceDependent from "../../Tools/DeviceDependent.js"
import loop from "../../Tools/Loop.js"
import easings from "../../Utils/easings.js"
import bind from "../../Utils/bind.js"
import on from "../../Utils/on.js"

export default class Button extends DeviceDependent {
  constructor(id, node) {
    super(node, {
      duration: 1000,
      ease: 'easeInOutCubic',
      align: 0,
      offset: 0,
      offsetFrom: {element: null, mult: 1}
    })

    this.id = id

    bind('navigate', this)

    this.endPoint = null

    this.active = false
    this.section = null
  }

  resize() {
    super.resize()
    if(!this.section) return;

    if(this.currentMedia.disabled) return;
    const stopsLengthBefore = model.instance.currentMedia.smooth ? model.sections.reduce((acc, curr) => {
      if(curr.id < this.section.id) {
        return acc + curr.stops.reduce((acc, curr) => acc += curr.orientationBox.length, 0)
      }
      return acc
    }, 0) : 0

    const isVertical = model.instance.currentMedia.type === 'vertical'
    const targetSize = isVertical ? this.currentMedia.target.offsetHeight : this.currentMedia.target.offsetWidth
    const align = this.currentMedia.align ? this.currentMedia.align * (model.screenSize - targetSize) : 0
    const offset = this.currentMedia.offset * model.screenSize
    const offsetFrom =
      this.currentMedia.offsetFrom.element ?
      (isVertical && this.currentMedia.offsetFrom.element.offsetHeight || this.currentMedia.offsetFrom.element.offsetWidth) * this.currentMedia.offsetFrom.mult :
      0


    if(isVertical) {
      let offsetTop = this.currentMedia.target === this.section.node ? 0 : this.currentMedia.target.offsetTop
      offsetTop += offset + offsetFrom - align
      this.endPoint = offsetTop + this.section.top + stopsLengthBefore
    } else {
      let offsetLeft = this.currentMedia.target === this.section.node ? 0 : this.currentMedia.target.offsetLeft
      offsetLeft += offset + offsetFrom - align
      this.endPoint = offsetLeft + this.section.left + stopsLengthBefore
    }
  }

  $applyNewMedia() {
    this.section = model.sections.find(section => section.node.contains(this.currentMedia.target))

    if(!this.active && this.section) {
      this.node.addEventListener('click', this.navigate)
      this.active = true
    }
  }

  $disable() {
    this.node.removeEventListener('click', this.navigate)
    this.active = false
  }

  navigate() {
    const startTime = Date.now()
    const currentScrollValue = force.scrollValue.current
    const delta = this.endPoint - currentScrollValue

    const stop = () => {
      loop.remove('nav-button'+this.id)
      removeListeners()
    }

    const removeListeners = on(window, 'wheel touchstart', stop)

    loop.add('nav-button' + this.id, () => {
      let t = (Date.now() - startTime) / this.currentMedia.duration
      t = easings[this.currentMedia.ease](t)
      if(t > 1) {
        stop()
        force.set(currentScrollValue + delta, false, true)
        return;
      }
      force.set(currentScrollValue + t * delta, false, true)
    })
  }
}