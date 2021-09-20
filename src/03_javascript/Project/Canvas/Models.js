import { Group, Mesh, MeshBasicMaterial, PointLight, TorusGeometry, Vector3 } from 'three'
import SceneObjects from '../../Library/Three/SceneObjects'
import scrollModel from '../../Library/Scroll/Model'
import scrollForce from '../../Library/Scroll/Force'
import vertexShader from '../../../04_shaders/cases/vertex.glsl'
import fragmentShader from '../../../04_shaders/cases/fragment.glsl'

export default class Models extends SceneObjects {
  constructor(assets) {
    super('model')
    this.assets = assets
    this.createMeshes()
    this.loopTrue()
  }

  createMeshes() {
    this.meshes = []

    for(let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]
      const node = box.node

      const modelName = node.getAttribute('data-model-name')
      const model = this.assets[modelName]

      this.meshes.push(model)
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
    t *= 0.0002

    const progress = scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN
    const length = scrollModel.scrollLength

    this.meshes.forEach((mesh, i) => {
      mesh.rotation.x = t + i
      mesh.rotation.z = t + i
      mesh.position.y = mesh.userData.initialPosition.y * progress + -length + length * progress
      mesh.position.x = mesh.userData.initialPosition.x * progress
      mesh.position.z = mesh.userData.initialPosition.z * progress
    })
  }
}