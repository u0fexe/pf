import anime from "animejs"
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
    t *= 0.0004

    if(innerWidth < 1024) {
      this.mobileMove(t)
    } else {
      this.desktopMove(t)
    }
  }


  mobileMove(t) {
    this.camera.position.z = this.camera.userData.z - (this.camera.userData.z - this.yarBox.mesh.scale.z * 0.6) * this.start
    this.camera.position.x = this.yarBox.mesh.scale.x * 0.01 * this.start
    this.camera.position.y = this.yarBox.mesh.scale.y * -0.2 * this.start
  }

  desktopMove(t) {

    this.mobileMove(t)
    this.camera.rotation.z = Math.sin(t) * 0.02
    this.camera.rotation.x = Math.cos(t ) * 0.01
    this.camera.rotation.y = Math.sin(t * 2) * 0.01
  }
}