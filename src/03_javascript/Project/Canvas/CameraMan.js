import anime from "animejs"
import { Vector3 } from "three"
import loop from "../../Library/Tools/Loop"

export default class CameraMan {
  constructor(camera, yarBox) {
    this.camera = camera
    this.yarBox = yarBox
    loop.add('cameraMan', 'tick', this)

    this.start = 0

    anime({
      targets: this,
      start: [1, 0],
      delay: 1000,
      duration: 3000,
      easing: 'easeInOutExpo',
    })

  }

  tick(t) {
    t *= 0.001

    this.camera.position.z = this.camera.userData.z - (this.camera.userData.z - this.yarBox.mesh.scale.z * 0.6) * this.start
    this.camera.position.x = this.yarBox.mesh.scale.x * 0.01 * this.start
    this.camera.position.y = this.yarBox.mesh.scale.y * -0.2 * this.start
    this.camera.rotation.z = Math.cos(t) * 0.01
  }
}