import model from './Model.js'
import Events from '../Tools/Events.js'
import cumulativeLeft from '../Utils/cumulativeLeft.js'
import cumulativeTop from '../Utils/cumulativeTop.js'
import css from '../Utils/css.js'

export default class Box {
  constructor(id, node, name, part) {
    this.id = id
    this.part = part
    this.node = node
    this.name = name || this.node.getAttribute('data-scroll-box')
    this.section = model.sections.find(section => section.node.contains(this.node)) || { top: 0, left: 0 }
    this.nodeAndSectionSame = this.section.node === this.node

    this.clear()

    this.events = new Events('resize')

    this.CSSOptions = {
      width: this.node.hasAttribute('data-width'),
      height: this.node.hasAttribute('data-height'),
      left: this.node.hasAttribute('data-left'),
      right: this.node.hasAttribute('data-right'),
      top: this.node.hasAttribute('data-top'),
      bottom: this.node.hasAttribute('data-bottom'),
    }
  }

  clear() {
    this.width = 0
    this.height = 0
    this.top = 0
    this.right = 0
    this.bottom = 0
    this.left = 0
    this.x = 0
    this.y = 0
  }

  resize() {
    this.width = this.node.offsetWidth
    this.height = this.node.offsetHeight
    this.top = this.nodeAndSectionSame ? this.section.top : this.section.top + cumulativeTop(this.node, this.section.node)
    this.bottom = this.top + this.height

    this.left = this.nodeAndSectionSame ? this.section.left : this.section.left + cumulativeLeft(this.node, this.section.node)
    this.right = this.left + this.width

    this.y = ((this.top + this.height / 2) / innerHeight * 2 - 1) * (innerHeight / 2) * -1
    this.x = ((this.left + this.width / 2) / innerWidth * 2 - 1) * (innerWidth / 2)
    this.z = css(this.node, '--z') || 0

    for(const property in this.CSSOptions) {
      if(!this.CSSOptions[property]) continue;
      const varName = `--${this.name || ''}${this.name ? '-' : ''}${property}`
      if(this.name) {
        document.documentElement.style.setProperty(varName, this[property] + 'px')
      } else {
        this.node.style.setProperty(varName, this[property] + 'px')
      }
    }

    this.events.notify('resize', this)
  }
}