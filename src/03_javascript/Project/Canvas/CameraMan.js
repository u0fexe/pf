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

    if(innerWidth > 1024) {
      this.desktopMove(t)
    }
  }


  desktopMove(t) {
    this.camera.rotation.z = Math.sin(t) * 0.02
    this.camera.rotation.x = Math.cos(t ) * 0.01
    this.camera.rotation.y = Math.sin(t * 2) * 0.01
  }
}