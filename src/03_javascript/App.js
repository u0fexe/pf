import scroll from './Library/Scroll'
import screenSize from './Library/Utils/screenSize'
import Canvas from './Project/Canvas'

export default class App {
  constructor() {
    this.resize()
    this.scroll()
    this.toggleCanvas()
  }

  resize() {
    addEventListener('resize', screenSize)
    screenSize()
  }

  scroll() {
    addEventListener('load', () => scroll.resize())
    scroll.events.addListener('newMedia', () => {
      this.toggleCanvas()
    })
  }

  toggleCanvas() {
    if(scroll.currentMedia.smooth && !this.canvas) {
      this.canvas = new Canvas(document.querySelector('.canvas'))
    }

    else if(!scroll.currentMedia.smooth && this.canvas) {
      this.canvas.deactivate()
    }

    else if(scroll.currentMedia.smooth && this.canvas) {
      this.canvas.activate()
    }
  }
}