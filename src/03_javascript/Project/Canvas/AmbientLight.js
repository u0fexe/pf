import { AmbientLight as THREEAmbientLight } from 'three'
import resizer from '../../Library/Tools/Resizer'

export default class AmbientLight {
  constructor() {
    this.params = {
      desktop: {
        color: 0xf9894e,
        intensity: 0.5,
      },

      mobile: {
        color: 0xf9c9c9,
        intensity: 0.65,
      }
    }

    this.mesh = new THREEAmbientLight(this.params.desktop.color, this.params.desktop.intensity)

    resizer.add('ambientLight', 'resize', this, true)
  }

  resize() {
    if(innerWidth > 768) {
      this.mesh.color.setHex(this.params.desktop.color)
      this.mesh.intensity = this.params.desktop.intensity
    } else {
      this.mesh.color.setHex(this.params.mobile.color)
      this.mesh.intensity = this.params.mobile.intensity
    }

  }

  gui(gui) {
    const folder = gui.addFolder('AmbientLight')

    folder.addColor(this.params.desktop, 'color').onChange((val) => {
      this.mesh.color.setHex(val)
    })

    folder.add(this.params.desktop, 'intensity', 0, 10, 0.01).onChange((val) => {
      this.mesh.intensity = val
    })

  }
}