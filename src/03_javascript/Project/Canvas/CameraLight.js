import { PointLight, SpotLightHelper } from "three"
import resizer from '../../Library/Tools/Resizer'

export default class CameraLight {
  constructor() {
    this.params = {
      color: 0x562703,
      intensity: 0.8,
      distance: 8000,
      angle: 0.11,
      penumbra: 1,
    }

    this.create()
    this.lastScene = null

    resizer.add('cameraLight', 'resize', this)
  }

  create() {
    this.mesh = new PointLight(this.params.color, this.params.intensity, this.params.distance, this.params.angle, this.params.penumbra)
    this.mesh.position.z = 2100
    this.mesh.position.y =  0
  }

  addTo(scene) {
    this.lastScene = scene
    this.resize()
  }

  resize() {
    if(innerWidth < 768) {
      this.lastScene.remove(this.mesh)
    } else {
      this.lastScene.add(this.mesh)
    }
  }

  gui(gui) {
    const folder = gui.addFolder('cameraLight')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.mesh.color.setHex(val)
    })

    folder.add(this.params, 'intensity', 0, 10, 0.01).onChange((val) => {
      this.mesh.intensity = val
    })

    // folder.add(this.params, 'distance', 0, 10000, 0.01).onChange((val) => {
    //   this.mesh.distance = val
    // })

    // folder.add(this.params, 'angle', 0, Math.PI/2, 0.01).onChange((val) => {
    //   this.mesh.angle = val
    // })

    // folder.add(this.params, 'penumbra', 0, 1, 0.01).onChange((val) => {
    //   this.mesh.penumbra = val
    // })

    // folder.add(this.mesh.position, 'x', -innerWidth, innerWidth, 0.01)
    // folder.add(this.mesh.position, 'y', -innerHeight, innerHeight, 0.01)
    // folder.add(this.mesh.position, 'z', -5000, 5000, 0.01)
  }
}