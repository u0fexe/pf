import scroll from './Library/Scroll'
import Canvas from './Project/Canvas'

export default class App {
  constructor() {
    this.scroll()
    this.toggleCanvas()
  }

  scroll() {
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