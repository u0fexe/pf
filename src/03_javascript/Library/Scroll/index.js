import Cache from "../Tools/Cache.js"
import Resizer from "../Tools/Resizer.js"
import Loop from "../Tools/Loop.js"
import DeviceDependent from "../Tools/DeviceDependent.js"
import Events from "../Tools/Events.js"

import model from "./Model.js"
import force from "./Force.js"
import controls from "./Controls/index.js"

class Scroll extends DeviceDependent {
  constructor() {
    super(Cache.root, {
      type: 'vertical',
      ease: 0.1,
      speedMultiplier: 1,
      smooth: false,
      progressVar: false,
      draggable: false,
      arrowsValue: 40,
      spaceValue: 100,
      speedDistance: 800,
      speedEase: 0.1,
      speedVar: false,
      dragAcceleration: 0,
      stopSnapEase: null,
      smoothWheel: false,
      staticSections: false,
      reverse: 1
    })

    model.instance = this
    force.instance = this
    controls.instance = this

    this.ready = false

    this.events = new Events('newMedia', 'resize')

    model.findParts()

    Resizer.add('scrollResize', 'resize', this, true)
    force.add(0)
  }

  resize() {
    super.resize()
    model.resizeSections()
    model.updateScreenSize()
    model.resizeBoxes()
    model.resizeStops()
    model.resizePaths()
    model.resizeTriggers()
    model.updateScrollLength()
    controls.scrollbar.resize()
    controls.resizeNavButtons()
    force.resize()

    this.events.notify('resize', { model, force })
  }

  activateSmoothness() {
    model.fixateSections()
    Loop.add('scrollTick', 'tick', this)
  }

  deactivateSmoothness() {
    model.unfixSections()
    Loop.remove('scrollTick')
  }

  $applyNewMedia() {
    if(this.currentMedia.smooth) {
      model.switchSectionsTranslateFunction()

      if(!this.previousMedia.smooth || !this.ready) {
        this.activateSmoothness()
        controls.default.unlisten()
        controls.wheel.listen()
        controls.keys.listen()
        controls.scrollbar.listen()
      }

      if(!this.previousMedia.draggable && this.currentMedia.draggable) {
        controls.drag.listen()
      }

    } else {
      this.currentMedia.speedMultiplier = 1
      this.deactivateSmoothness()

      if(this.previousMedia.smooth || !this.ready) {
        controls.default.listen()
        controls.wheel.unlisten()
        controls.drag.unlisten()
        controls.keys.unlisten()
        controls.scrollbar.unlisten()
      }
    }

    if(!this.currentMedia.progressVar && this.previousMedia.progressVar) {
      this.node.style.removeProperty('--scroll-progress')
    }

    if(!this.currentMedia.speedVar && this.previousMedia.speedVar) {
      this.node.style.removeProperty('--scroll-speed')
    }

    if(!this.currentMedia.smooth) {
      model.activeStop = null
      model.passedStopsLength = 0
    }

    force.reset()
    force.update()

    this.ready = true

    this.events.notify('newMedia', this.currentMedia, this.previousMedia)
  }

  tick() {
    force.update()
    model.translateSections()
  }
}

const scroll = new Scroll()
export default scroll