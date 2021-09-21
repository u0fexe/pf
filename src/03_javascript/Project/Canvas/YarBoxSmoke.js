import { AdditiveBlending, PlaneBufferGeometry, Group, Mesh, MeshLambertMaterial, DoubleSide } from "three"

import random from "../../Library/Utils/random"
import scrollModel from "../../Library/Scroll/Model"
import SceneObject from '../../Library/Three/SceneObject'

export default class YarBoxSmoke extends SceneObject {
  constructor(texture, yarBox, camera) {
    super('yarBoxSmoke')

    this.texture = texture
    this.yarBox = yarBox
    this.camera = camera

    this.params = {
      count: 50,
      color: 0xbc00ff
    }

    this.openingProgress = 0
    scrollModel.addPathListener('lidOpening', 'progress', (data) => {
      this.openingProgress = data.interpolatedN
    })

    this.createParticles()
    this.created = true
    this.resize()
    this.loopTrue()
  }

  createParticles() {
    this.mesh = new Group()
    this.mesh.position.y = (scrollModel.scrollLength ) * -1

    const geometry = new PlaneBufferGeometry(1, 1)

    for(let i = 0; i < this.params.count; i++) {
      const material = new MeshLambertMaterial({ color: this.params.color, map: this.texture, transparent: true, side: DoubleSide, opacity: 0.2,  depthWrite: false, blending: AdditiveBlending})
      const particle = new Mesh(geometry, material)
      this.mesh.add(particle)
    }
  }

  matchSize() {
    let scale = (this.box.width + this.box.height) / 2 * 4

    this.mesh.children.forEach((child, i, cr) => {
      const progress = i / this.params.count
      child.position.set(
        (Math.random() * 2 - 0.7) * this.box.width * 3 * progress,
        -this.box.height + this.box.height * progress * 3,
        random(this.yarBox.mesh.scale.z * 2 * progress)
      )
      child.material.opacity = (1 - progress) * 0.3

      const childScale = scale - (scale * 0.8) * (1 - progress * 2)
      child.scale.set(childScale, childScale, childScale)

      child.userData.scale = childScale
      child.userData.position = child.position
    })
  }

  gui(gui) {
    const folder = gui.addFolder('smoke')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.mesh.children[0].material.color.setHex(val)
      console.log( this.mesh.children[0].material.color)
    })
  }

  tick(t) {
    t *= 0.0003
    this.mesh.lookAt(this.camera.position)

    const p2 = this.openingProgress * this.openingProgress
    this.mesh.children.forEach((child, i, ca) => {
      child.rotation.z = t * Math.cos(i)
      child.scale.set(
        child.userData.scale * this.openingProgress,
        child.userData.scale * p2,
        child.userData.scale * this.openingProgress,
      )
      child.position.y = -this.box.height + (i / ca.length * 3000) * p2
      child.position.x = child.userData.position.x * this.openingProgress
    })
  }
}