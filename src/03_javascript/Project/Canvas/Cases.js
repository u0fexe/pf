import { BoxBufferGeometry, DoubleSide, MeshStandardMaterial, SphereBufferGeometry, TetrahedronBufferGeometry, Vector3 } from 'three'
import ExplorableObject from './ExplorableObject'
import ExplorableObjects from './ExplorableObjects'
import fitTexture from '../../Library/Three/Helpers/fitTexture'

export default class Cases extends ExplorableObjects {
  constructor(assets) {
    super('case')

    this.construct(assets)
    this.created = true
    this.events.notify('ready')
  }

  construct(assets) {
    for (let i = assets.length - 1; i > 0; i--) {
      fitTexture(assets[i], this.boxes[i] || this.boxes[0])
      const j = Math.floor(Math.random() * (i + 1));
      [assets[i], assets[j]] = [assets[j], assets[i]];
    }

    const geometries = [
      new BoxBufferGeometry(1, 1, 1),
      new SphereBufferGeometry(0.5, 40, 40),
      new TetrahedronBufferGeometry(1, 0),
    ]

    this.createObjects(
      ExplorableObject,
      geometries,
      i => new MeshStandardMaterial({ side: DoubleSide, map: assets[i] })
    )

    for (let id = 0; id < this.objects.length; id++) {
      this.resize(id)
    }
  }

  matchSize(id) {
    const object = this.objects[id]
    const box = this.boxes[id]
    const min = object.step * 0.2 + 0.8

    object.mesh.scale.set(box.width * min, box.height * min, (box.width + box.height) / 2 * min)
    object.initialScale.copy(object.mesh.scale)
  }

  matchPosition(id) {
    const object = this.objects[id]
    const box = this.boxes[id]
    const mesh = object.mesh

    const screenWidth = innerWidth - box.width
    const screenHeight = innerHeight - box.height
    const frequency = Math.PI * (this.boxes.length / 3.5)
    const minimizer = object.step * 0.6 + 0.4

    mesh.position.y = box.y
    mesh.position.x = Math.cos(object.step * frequency) * screenWidth * 1.5 * minimizer * minimizer
    mesh.position.z = Math.sin(object.step * frequency) * ((screenHeight + screenWidth) * 0.5) * minimizer
    object.initialPosition = new Vector3().copy(mesh.position)
  }
}