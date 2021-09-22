import { AdditiveBlending, PlaneBufferGeometry, Group, Mesh, MeshLambertMaterial, DoubleSide, Vector3 } from "three"

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
      count: 100,
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

    const geometry = new PlaneBufferGeometry(1, 1)

    for(let i = 0; i < this.params.count; i++) {
      const material = new MeshLambertMaterial({ color: this.params.color, map: this.texture, transparent: true, side: DoubleSide, opacity: 0.2,  depthWrite: false, blending: AdditiveBlending})
      const particle = new Mesh(geometry, material)
      particle.userData.position = new Vector3()
      particle.userData.scale = new Vector3()
      this.mesh.add(particle)
    }
  }

  matchPosition() {
    this.mesh.position.y = this.box.y - this.yarBox.box.height * 1.2

    this.mesh.children.forEach((child, i, cr) => {
      const progress = i / this.params.count

      child.position.set(
        (Math.random() * 2 - 0.7) * this.box.width * 3 * progress,
        this.box.height * 4 * progress,
        random(this.yarBox.mesh.scale.z * 2 * progress)
      )

      child.userData.position.copy(child.position)

      child.material.opacity = (1 - progress ) * 0.3
    })
  }

  matchSize() {
    let scale = (this.box.width + this.box.height) * 2

    this.mesh.children.forEach((child, i, cr) => {
      const progress = i / this.params.count

      const childScale = scale - (scale * 0.8) * (1 - progress * 2)
      child.scale.set(childScale, childScale, childScale)
      child.userData.scale.copy(child.scale)
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
    const p4 = p2 * this.openingProgress * this.openingProgress
    this.mesh.children.forEach((child, i, ca) => {
      child.rotation.z = t * Math.cos(i)
      child.scale.set(
        child.userData.scale.x * p4,
        child.userData.scale.y * p4,
        child.userData.scale.z * p4,
      )
      child.position.y = child.userData.position.y * p2
      child.position.x = child.userData.position.x * p2
    })
  }
}