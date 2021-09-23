import { RectAreaLight } from "three"
import model from "../../Library/Scroll/Model"

export default class BottomLight {
  constructor(box) {
    this.params = {
      color: 0xff0000,
      intensity: 10,
    }

    this.box = box

    this.box.events.addListener('resize', this.resize.bind(this))

    this.createMesh()
  }

  createMesh() {
    this.mesh = new RectAreaLight ( this.params.color, this.params.intensity, this.box.width, this.box.height )
    this.mesh.position.set( 0, model.scrollLength * -1, 0 )
    this.mesh.lookAt( 0, 0, 0 )
  }

  addTo(scene) {
    scene.add(this.mesh)
  }

  resize() {
    this.mesh.width = this.box.width
    this.mesh.height = this.box.height
    this.mesh.position.set( 0, model.scrollLength * -1, 0 )
  }

  gui(gui) {
    const folder = gui.addFolder('bottomLight')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.mesh.color.setHex(val)
    })

    folder.add(this.params, 'intensity', 0, 10, 0.1).onChange((val) => {
      this.mesh.intensity = val
    })
  }
}