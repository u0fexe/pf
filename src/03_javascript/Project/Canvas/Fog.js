import { Fog as THREEFog } from 'three'

export default class Fog {
  constructor(scene) {
    this.scene = scene

    this.params = {
      color: 0x0,
      near: 1000,
      far: 13000,
    }

    this.scene.fog = new THREEFog(this.params.color, this.params.near, this.params.far)
  }
}