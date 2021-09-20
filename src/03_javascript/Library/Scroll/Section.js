import model from './Model.js'
import force from './Force.js'

import getHeightWithMargins from '../Utils/getHeightWithMargins.js'
import getWidthWithMargins from '../Utils/getWidthWithMargins.js'
import cumulativeLeft from '../Utils/cumulativeLeft.js'
import cumulativeTop from '../Utils/cumulativeTop.js'
import Events from '../Tools/Events.js'

export default class Section {
  constructor(id, node) {
    this.id = id
    this.node = node
    this.name = this.node.getAttribute('data-scroll-section')
    this.inView = false
    this.events = new Events('in', 'out')

    this.stops = []
    this.translateFunction = null
  }

  fixate() {
    this.node.style.position = 'fixed'
    this.node.style.top = '0'
    this.node.style.left = '0'
  }

  unfix() {
    this.node.style.position = ''
    this.node.style.top = ''
    this.node.style.left = ''
    this.node.style.transform = ''
  }

  resize() {
    this.widthWithMargins = getWidthWithMargins(this.node)
    this.heightWithMargins = getHeightWithMargins(this.node)

    const previousSection = model.sections.find(section => section.id === this.id - 1)
    if(previousSection) {
      this.top = model.instance.currentMedia.type === 'vertical' ? previousSection.bottom : cumulativeTop(this.node)
      this.left = model.instance.currentMedia.type === 'horisontal' ? previousSection.right : cumulativeLeft(this.node)
      this.bottom = this.top + this.heightWithMargins
      this.right = this.left + this.widthWithMargins
    } else {
      this.top = cumulativeTop(this.node)
      this.left = cumulativeLeft(this.node)
      this.bottom = this.top + this.heightWithMargins
      this.right = this.left + this.widthWithMargins
    }
  }

  switchTranslateFunction() {
    this.translateFunction = model.instance.currentMedia.type === 'vertical' ? this.translateY : this.translateX
    this.node.style.transform = `translate3d(0px, ${this.top}px, 0px)`
  }

  in() {
    if(!this.inView || model.currentSection !== this) {
      this.inView = true
      this.events.notify('in')
    }
  }

  out() {
    if(this.inView) {
      this.inView = false
      this.events.notify('out')
    }
  }

  check() {

    if(force.scrollValue.stopsDependent > this.left - model.screenSize && force.scrollValue.stopsDependent <= this.right) {
      this.in()
    } else {
      this.out()
    }
  }

  translateX() {
    let initial = this.left
    let forced = 0

    if(force.scrollValue.stopsDependentInterpolated > this.right) {
      forced = (initial + this.widthWithMargins) * -1
    }

    else if(force.scrollValue.stopsDependentInterpolated > this.left - model.screenSize) {
      forced = force.scrollValue.stopsDependentInterpolated * -1
    }

    this.node.style.transform = `translate3d(${initial + forced}px, 0px, 0px)`
  }

  translateY() {
    let initial = this.top
    let forced = 0

    if(force.scrollValue.stopsDependentInterpolated > this.bottom) {
      forced = (initial + this.heightWithMargins) * -1
    }

    else if(force.scrollValue.stopsDependentInterpolated > this.top - model.screenSize) {
      forced = force.scrollValue.stopsDependentInterpolated * -1
    }

    this.node.style.transform = `translate3d(0px, ${initial + forced}px, 0px)`
  }
}