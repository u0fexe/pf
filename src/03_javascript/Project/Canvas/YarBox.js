import { DoubleSide, Group, MeshStandardMaterial } from "three"
import { Text } from 'troika-three-text'
import SceneObject from '../../Library/Three/SceneObject'
import fitTexture from '../../Library/Three/Helpers/fitTexture'
import setPlane from '../../Library/Three/Helpers/setPlane'

export default class YarBox extends SceneObject {
  constructor(assets) {
    super('yarBox')
    this.assets = assets
    this.createBoxMesh()
    this.createLinks()
    this.created = true
    this.resize()
  }

  createBoxMesh() {
    fitTexture(this.assets.yarBox.logo, this.box)
    this.mesh = new Group()
    const material = new MeshStandardMaterial({ color: 'black', side: DoubleSide })
    const logoMaterial = new MeshStandardMaterial({ color: 'white', map: this.assets.yarBox.logo, side: DoubleSide })

    this.mesh.add(setPlane('y',  Math.PI * 0.5, material)) // px
    this.mesh.add(setPlane('y', -Math.PI * 0.5, material)) // nx
    this.mesh.add(setPlane('x',  Math.PI * 0.5, material)) // ny
    this.mesh.add(setPlane('y',  0, logoMaterial)) // pz
    this.mesh.add(setPlane('y',  Math.PI, material) ) // nz
  }


  createLinks() {
    this.links = [...this.box.node.querySelectorAll('[href]')].map(link => {
      const text = link.innerHTML.trim()
      const href = link.href

      return { text, href }
    })

    if(!this.links.length) return;

    this.links.forEach((link, i) => {
      link.mesh = new Text()
      link.mesh.font = 'multimedia/fonts/Oswald/Oswald-Bold.ttf'
      link.mesh.text = link.text
      link.mesh.fontSize = 0.04
      link.mesh.position.z = -0.51
      link.mesh.position.x = -0
      link.mesh.position.y = 0.2 - (i / this.links.length * 0.4)
      link.mesh.anchorX = 'left'
      link.mesh.rotation.y = Math.PI
      link.mesh.color = 0xffffff
      link.mesh.material = new MeshStandardMaterial()
      link.mesh.sync()
      this.mesh.add(link.mesh)
    })
  }

  matchSize() {
    this.mesh.scale.set(this.box.width, this.box.height, (this.box.width + this.box.height) / 2)
  }
}