
import loop from "../../Library/Tools/Loop"

export default class CameraMan {
  constructor(camera) {
    this.camera = camera
    loop.add('cameraMan', 'tick', this)
  }

  tick(t) {
    t *= 0.001
    this.camera.position.z += Math.cos(t) * 0.3
    this.camera.position.x += Math.sin(t) * 0.05
    this.camera.rotation.z = Math.cos(t) * 0.01
  }
}