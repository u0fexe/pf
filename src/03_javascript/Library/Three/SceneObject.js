import scrollModel from '../Scroll/Model.js'
import Events from '../Tools/Events.js'
import loop from '../Tools/Loop.js'

let id = 0

export default class SceneObject {
  constructor(boxName) {
    this.id = ++id
    this.boxName = boxName
    this.created = false
    this.disabled = false
    this.events = new Events('ready')
    this.createBox()
  }

  createBox() {
    this.box = scrollModel.findBox(this.boxName)
    if(!this.box) return console.error(`${this.boxName}: box not found`)
    this.box.events.addListener('resize', this.resize.bind(this))
  }

  warn(text) {
    console.error(`${this.name}: ${text}`)
  }

  loopTrue() {
    if(!this.box || !this.tick || !this.created || this.disabled) return;
    loop.add(this.boxName + this.id, 'tick', this)
  }

  loopFalse() {
    if(!this.box || !this.tick || !this.created || this.disabled) return;
    loop.removeAfterDelay(this.boxName + this.id)
  }

  matchPosition() {
    this.mesh.position.y = this.box.y
    this.mesh.position.x = this.box.x
  }

  matchSize() {
    this.mesh.scale.set(this.box.width, this.box.height, 1)
  }

  disable() {
    this.disabled = true
  }

  enable() {
    this.disabled = false
  }

  resize() {
    if(!this.created || !this.box) return;

    this.matchPosition()
    this.matchSize()
  }
}