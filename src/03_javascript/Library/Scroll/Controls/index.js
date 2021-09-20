import Wheel from './Wheel.js'
import Default from './Default.js'
import Drag from './Drag.js'
import Keys from './Keys.js'
import Scrollbar from './Scrollbar.js'
import Button from './Button.js'

class Controls {
  constructor() {
    this.instance = null
    this.default = new Default()
    this.wheel = new Wheel()
    this.drag = new Drag()
    this.keys = new Keys()
    this.scrollbar = new Scrollbar()
    this.navButtons = [...document.querySelectorAll('[data-scroll-nav-button]')].map((el, id) => new Button(id, el))
  }

  resizeNavButtons() {
    this.navButtons.forEach(navButton => navButton.resize())
  }

  dragAnyDirection(value) {
    this.drag.anyDirection = value
  }
}

const controls = new Controls()
export default controls
