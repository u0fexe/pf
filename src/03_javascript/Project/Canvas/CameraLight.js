import { SpotLight, SpotLightHelper } from "three"

export default class YarBoxLight {
  constructor() {
    this.params = {
      color: 0xff9800,
      intensity: 0.68,
      distance: 8000,
      angle: 0.11,
      penumbra: 1,
    }

    this.create()
  }

  create() {
    this.mesh = new SpotLight(this.params.color, this.params.intensity, this.params.distance, this.params.angle, this.params.penumbra)
    this.mesh.position.z = 2100
    this.mesh.position.y =  0
  }

  addTo(scene) {
    scene.add(this.mesh)
  }

  gui(gui) {
    const folder = gui.addFolder('cameraLight')
    folder.open()

    folder.addColor(this.params, 'color').onChange((val) => {
      this.mesh.color.setHex(val)
    })

    folder.add(this.params, 'intensity', 0, 10, 0.01).onChange((val) => {
      this.mesh.intensity = val
    })

    folder.add(this.params, 'distance', 0, 10000, 0.01).onChange((val) => {
      this.mesh.distance = val
    })

    folder.add(this.params, 'angle', 0, Math.PI/2, 0.01).onChange((val) => {
      this.mesh.angle = val
    })

    folder.add(this.params, 'penumbra', 0, 1, 0.01).onChange((val) => {
      this.mesh.penumbra = val
    })

    folder.add(this.mesh.position, 'x', -innerWidth, innerWidth, 0.01)
    folder.add(this.mesh.position, 'y', -innerHeight, innerHeight, 0.01)
    folder.add(this.mesh.position, 'z', -5000, 5000, 0.01)
  }
}