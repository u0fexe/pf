import { BoxBufferGeometry, DoubleSide, MeshStandardMaterial, SphereBufferGeometry, TetrahedronBufferGeometry, Vector3 } from 'three'
import ExplorableObject from './ExplorableObject'
import ExplorableObjects from './ExplorableObjects'
// import fitTexture from '../../Library/Three/Helpers/fitTexture'

export default class Cases extends ExplorableObjects {
  constructor(assets) {
    super('case')

    this.construct(assets)
    this.created = true
    this.events.notify('ready')
  }

  construct(assets) {
    const geometries = [
      new BoxBufferGeometry(1, 1, 1),
      new SphereBufferGeometry(0.5, 40, 40),
      new TetrahedronBufferGeometry(1, 0),
    ]

    this.createObjects(
      ExplorableObject,
      geometries,
      box => {
        const map = assets.find(asset => asset.userData.element === box.node) || assets[0]
        return new MeshStandardMaterial({ side: DoubleSide, map })
      }
    )

    for (let id = 0; id < this.objects.length; id++) {
      this.resize(id)
    }
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