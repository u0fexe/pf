import { AmbientLight as THREEAmbientLight } from 'three'

export default class AmbientLight {
  constructor() {
    this.params = {
      color: 0x4b0096,
      intensity: 0.5,
    }

    this.mesh = new THREEAmbientLight(this.params.color, this.params.intensity)
  }

  gui(gui) {
    const folder = gui.addFolder('ambientLight')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.mesh.color.setHex(val)
    })

    folder.add(this.params, 'intensity', 0, 1, 0.01).onChange((val) => {
      this.mesh.intensity = val
    })
  }
}