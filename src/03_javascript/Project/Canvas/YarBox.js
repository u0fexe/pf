import { DoubleSide, Mesh, Group, MeshStandardMaterial, PlaneBufferGeometry, SpotLight } from "three"
import { Text } from 'troika-three-text'
import SceneObject from '../../Library/Three/SceneObject'
import fitTexture from '../../Library/Three/Helpers/fitTexture'
import setPlane from '../../Library/Three/Helpers/setPlane'

export default class YarBox extends SceneObject {
  constructor(assets) {
    super('yarBox')
    this.assets = assets
    this.params = {
      color: 0xff9800,
      intensity: 1,
      distance: 1000,
      angle: Math.PI/2,
      penumbra: 1,
    }

    this.createBoxMesh()
    this.createLight()
    this.createLinks()
    this.created = true
    this.resize()
  }

  createBoxMesh() {
    fitTexture(this.assets.logo, this.box)
    this.mesh = new Group()
    const material = new MeshStandardMaterial({ color: 'black', side: DoubleSide })
    const logoMaterial = new MeshStandardMaterial({ color: 'white', map: this.assets.logo, side: DoubleSide })

    this.mesh.add(setPlane('y',  Math.PI * 0.5, material)) // px
    this.mesh.add(setPlane('y', -Math.PI * 0.5, material)) // nx
    this.mesh.add(setPlane('x',  Math.PI * 0.5, material)) // ny
    this.mesh.add(setPlane('y',  0, logoMaterial)) // pz
    this.mesh.add(setPlane('y',  Math.PI, material) ) // nz
  }

  createLight() {
    this.light = new SpotLight(this.params.color, this.params.intensity, this.params.distance, this.params.angle, this.params.penumbra)
    this.light.position.z = 0.6
    this.light.position.y = 0
    this.mesh.add(this.light)
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

  gui(gui) {
    const folder = gui.addFolder('contactsLight')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.light.color.setHex(val)
    })

    folder.add(this.params, 'intensity', 0, 10, 0.01).onChange((val) => {
      this.light.intensity = val
    })

    folder.add(this.params, 'distance', 0, 1000, 0.01).onChange((val) => {
      this.light.distance = val
    })

    folder.add(this.params, 'angle', 0, Math.PI/2, 0.01).onChange((val) => {
      this.light.angle = val
    })

    folder.add(this.params, 'penumbra', 0, 1, 0.01).onChange((val) => {
      this.light.penumbra = val
    })

    folder.add(this.light.position, 'x', -2, 2, 0.01)
    folder.add(this.light.position, 'y', -2, 2, 0.01)
    folder.add(this.light.position, 'z', -2, 2, 0.01)
  }
}