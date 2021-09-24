import { BackSide, DoubleSide, FrontSide, Group, MeshStandardMaterial } from 'three'

import SceneObject from '../../Library/Three/SceneObject'
import setPlane from '../../Library/Three/Helpers/setPlane'
import scrollModel from '../../Library/Scroll/Model'
import scrollForce from '../../Library/Scroll/Force'

export default class YarBoxLid extends SceneObject {
  constructor(assets, yarBox) {
    super('yarBoxLid')
    this.assets = assets
    this.yarBox = yarBox
    this.createMesh()
    this.created = true
    this.resize()
    this.loopTrue()
  }

  createMesh() {
    this.mesh = new Group()
    this.mesh.position.z = this.box.z
    this.mesh.rotation.x = 1
    this.mesh.rotation.y = 0
    this.mesh.rotation.z = 0.5
    const material = new MeshStandardMaterial({ color: 0x000000, side: DoubleSide })
    const cactusMaterialFront = new MeshStandardMaterial({ color: 0xFFFFFF, map: this.assets.cactus, side: FrontSide })
    const cactusMaterialBack = new MeshStandardMaterial({ color: 0x000000, side: BackSide })

    this.mesh.add(setPlane('y',  Math.PI * 0.5, material)) // px
    this.mesh.add(setPlane('y', -Math.PI * 0.5, material)) // nx
    this.mesh.add(setPlane('x',  -Math.PI * 0.5, cactusMaterialFront)) // py
    this.mesh.add(setPlane('x',  -Math.PI * 0.5, cactusMaterialBack)) // py
    this.mesh.add(setPlane('y',  0, material)) // pz
    this.mesh.add(setPlane('y',  Math.PI, material) ) // nz

    this.mesh.userData.rotation = {x: this.mesh.rotation.x, y: this.mesh.rotation.y, z: this.mesh.rotation.z}
  }

  matchPosition() {
    super.matchPosition()
    this.mesh.userData.position = {x: this.mesh.position.x, y: this.mesh.position.y, z: this.mesh.position.z}
  }

  matchSize() {
    setTimeout(() => {
      this.mesh.scale.set(this.yarBox.mesh.scale.x, this.box.height, this.yarBox.mesh.scale.z * 1.01)
    }, 0)
  }

  tick() {
    const progress = scrollForce.scrollValue.interpolatedN * 2
    this.mesh.position.z = 1000 * progress
    this.mesh.position.y = this.mesh.userData.position.y + (scrollModel.scrollLength * 0.1) * progress
    this.mesh.position.x = this.mesh.userData.position.x * progress
    this.mesh.rotation.x = this.mesh.userData.rotation.x * progress
    this.mesh.rotation.y = this.mesh.userData.rotation.y * progress
    this.mesh.rotation.z = this.mesh.userData.rotation.z * progress
  }
}