import { Mesh } from 'three'
import SceneObjects from '../../Library/Three/SceneObjects'


export default class ExplorableObjects extends SceneObjects {
  constructor(name) {
    super(name)
    this.objects = []
  }

  createObjects(Wrapper, geometries, materialCallback, ) {
    for(let i = 0; i < this.boxes.length; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)]
      const material = materialCallback(i)
      const mesh = new Mesh(geometry, material)
      this.objects.push(new Wrapper(mesh, this.boxes[i], i, i / (this.boxes.length - 1)))
    }
  }

  matchPosition(id) {
    const object = this.objects[id]
    const box = this.boxes[id]

    object.mesh.position.y = box.y
    object.mesh.position.x = box.x
    object.mesh.position.z = box.z
    object.initialPosition.copy(object.mesh.position)
  }

  matchSize(id) {
    const object = this.objects[id]
    const box = this.boxes[id]

    object.mesh.scale.set(box.width, box.height, (box.width + box.height) / 2)
    object.initialScale.copy(object.mesh.scale)
  }

  addTo(scene) {
    this.objects.forEach(object => {
      scene.add(object.mesh)
    })
  }
}