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

    object.mesh[id].position.y = box[id].y
    object.mesh[id].position.x = box[id].x
    object.mesh[id].position.z = box[id].z
    this.objects[id].initialPosition.copy(this.objects[id].mesh.position)
  }

  matchSize(id) {
    this.objects[id].mesh.scale.set(this.boxes[id].width, this.boxes[id].height, (this.boxes[id].width + this.boxes[id].height) / 2)
    this.objects[id].initialScale.copy(this.objects[id].mesh.scale)
  }

  addTo(scene) {
    this.objects.forEach(object => {
      scene.add(object.mesh)
    })
  }
}