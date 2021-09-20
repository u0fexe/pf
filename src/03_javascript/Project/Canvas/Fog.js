import { Fog as THREEFog } from 'three'

export default class Fog {
  constructor(scene) {
    this.scene = scene

    this.params = {
      color: 0x0,
      near: 3600,
      far: 17000,
    }

    this.scene.fog = new THREEFog(this.params.color, this.params.near, this.params.far)
  }

  gui(gui) {
    const folder = gui.addFolder('fog')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.scene.fog.color.setHex(val)
    })

    folder.add(this.params, 'near', 0, 20000, 1).onChange((val) => {
      this.scene.fog.near = val
    })

    folder.add(this.params, 'far', 0, 20000, 1).onChange((val) => {
      this.scene.fog.far = val
    })
  }
}