import { Group, Mesh, MeshBasicMaterial, PointLight, TorusGeometry, Vector3 } from 'three'
import SceneObjects from '../../Library/Three/SceneObjects'
import scrollModel from '../../Library/Scroll/Model'
import scrollForce from '../../Library/Scroll/Force'

export default class PointLights extends SceneObjects {
  constructor() {
    super('pointLight')
    this.shapes = []
    this.createMeshes()
    this.loopTrue()
  }

  createMeshes() {
    this.meshes = []

    for(let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]
      const node = box.node

      const color = node.getAttribute('data-color') || 'white'
      const intencity = +node.getAttribute('data-intensity') || 1
      const distance = +node.getAttribute('data-distance') || 1000
      const decay = +node.getAttribute('data-decay') || 1
      const shape = node.getAttribute('data-shape')

      const group = new Group()

      const light = new PointLight(color, intencity, distance, decay)
      light.castShadow = true
      group.add(light)

      if(shape) {
        const geometry = new TorusGeometry( 1, 0.3, 16, 100 );
        const material = new MeshBasicMaterial({color})
        const shape = new Mesh(geometry, material)
        this.shapes.push(shape)
        group.add(shape)
      }

      this.meshes.push(group)
    }

    this.created = true
    for (let id = 0; id < this.meshes.length; id++) {
      this.resize(id)
    }
    this.events.notify('ready')
  }

  addOnScene(scene) {
    super.addOnScene(scene)
  }

  helpers(scene) {
    // this.meshes.forEach(mesh => {
    //   const pointLightHelper = new PointLightHelper( mesh, 1 )
    //   scene.add( pointLightHelper )
    // })
  }

  matchPosition(id) {
    const mesh = this.meshes[id]
    const box = this.boxes[id]
    mesh.position.x = box.x
    mesh.position.y = box.y
    mesh.position.z = box.z
    mesh.userData.initialPosition = new Vector3().copy(mesh.position)
  }

  matchSize(id) {
    const mesh = this.meshes[id]
    const box = this.boxes[id]
    mesh.scale.set(box.width, box.height, (box.width + box.height) / 2)
  }

  tick(t) {
    t *= 0.0005

    const progress = scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN
    const length = scrollModel.scrollLength

    this.meshes.forEach((mesh, i) => {
      mesh.rotation.x = t + i
      mesh.position.y = mesh.userData.initialPosition.y * progress + -length + length * progress
      mesh.position.x = mesh.userData.initialPosition.x * progress
      mesh.position.z = mesh.userData.initialPosition.z * progress
    })
  }
}