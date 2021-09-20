import scrollModel from '../Scroll/Model.js'
import Events from '../Tools/Events.js'
import loop from '../Tools/Loop.js'

export default class SceneObject {
  constructor(boxName) {
    this.boxName = boxName
    this.created = false
    this.disabled = false
    this.events = new Events('ready')
    this.createBoxes()
  }

  createBoxes() {
    this.boxes = scrollModel.findBoxes(this.boxName)
    if(!this.boxes.length) return console.error(`${this.boxName}: boxes not found`)
    this.boxes.forEach((box, i) => {
      box.events.addListener('resize', () => this.resize(i))
    })
  }

  addTo(container) {
    this.meshes.forEach(mesh => container.add(mesh))
  }

  warn(text) {
    console.error(`${this.name}: ${text}`)
  }

  loopTrue() {
    if(!this.tick || !this.created || this.disabled) return;
    loop.add(this.boxName, 'tick', this)
  }

  loopFalse() {
    if(!this.tick || !this.created || this.disabled) return;
    loop.removeAfterDelay(this.boxName)
  }

  matchPosition(id) {
    this.meshes[id].position.y = this.boxes[id].y
    this.meshes[id].position.x = this.boxes[id].x
  }

  matchSize(id) {
    this.meshes[id].scale.set(this.boxes[id].width, this.boxes[id].height, 1)
  }

  disable() {
    this.disabled = true
  }

  addOnScene(scene) {
    this.meshes.forEach(mesh => {
      scene.add(mesh)
    })
  }

  enable() {
    this.disabled = false
  }

  resize(id) {
    if(!this.created) return;

    this.matchPosition(id)
    this.matchSize(id)
  }
}