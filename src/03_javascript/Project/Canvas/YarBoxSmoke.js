import random from "../../Library/Utils/random"
import Particles from "./Particles"

export default class YarBoxSmoke extends Particles {
  constructor(texture, yarBox, camera) {
    super({
      texture,
      size: 3000,
      count: 100,
      opacity: 0.1,
      timeMiltiplier: 0.0002,
      sizeProgress: true,
      opacityProgress: true,
      colors: ['#ff7317', '#2c8eff']
    })

    this.yarBox = yarBox
    this.camera = camera

  }

  generatePosition(step, frequency, scrollLength) {
    const x = random(this.yarBox.box.width * 4) * step
    const y = this.yarBox.box.y  + scrollLength * 0.7 * step
    const z = random(this.yarBox.mesh.scale.z * 4) * step

    return { x, y, z }
  }

  generateSize(step) {
    return this.params.size * (step * 0.5 + 0.5)
  }
}