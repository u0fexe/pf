import { BoxBufferGeometry, DoubleSide, Mesh, MeshStandardMaterial, SphereBufferGeometry, TetrahedronBufferGeometry, Vector3 } from 'three'

import Explore from './Explore'
import Explorable from './Explorable'

export default class Cases extends Explore {
  constructor(assets) {
    super('case')

    this.createObjects(assets)
    this.loopTrue()
  }

  createObjects(assets) {
    for (let i = assets.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assets[i], assets[j]] = [assets[j], assets[i]];
    }

    const geometries = [
      new BoxBufferGeometry(1, 1, 1),
      new SphereBufferGeometry(0.5, 40, 40),
      new TetrahedronBufferGeometry(1, 0),
    ]

    for(let i = 0; i < this.boxes.length; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = new MeshStandardMaterial({ side: DoubleSide, map: assets[i] })
      const mesh = new Mesh(geometry, material)
      const explorable = new Explorable(mesh, this.boxes[i], this, i, i / this.boxes.length)
      this.objects.push(explorable)
    }

    for (let id = 0; id < this.objects.length; id++) {
      this.resize(id)
    }

    this.created = true
    this.events.notify('ready')
  }

  matchPosition(id) {
    const object = this.objects[id]
    const box = this.boxes[id]
    const mesh = object.mesh

    const screenWidth = innerWidth - box.width
    const screenHeight = innerHeight - box.height
    const frequency = Math.PI * 12
    const minimizer = object.step * 0.6 + 0.4

    mesh.position.y = box.y
    mesh.position.x = Math.cos(object.step * frequency) * screenWidth * 1.5 * minimizer * minimizer
    mesh.position.z = Math.sin(object.step * frequency) * ((screenHeight + screenWidth) * 0.8) * minimizer
    object.initialPosition = new Vector3().copy(mesh.position)
  }
}