import ExplorableObjects from "./ExplorableObjects"
import Model from "./Model"

export default class Models extends ExplorableObjects {
  constructor(assets) {
    super('model')
    this.construct(assets)
    this.created = true
    this.events.notify('ready')
  }

  construct(assets) {
    for(let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]
      const node = box.node

      const modelName = node.getAttribute('data-model-name')
      const model = assets[modelName]

      this.connectParts(model)

      this.objects.push(new Model(model, this.boxes[i], i, i / (this.boxes.length - 1)))
    }

    for (let id = 0; id < this.objects.length; id++) {
      this.resize(id)
    }
  }

  connectParts(model) {
    model.traverse((object) => {
      if(object.type === 'Mesh') {
        object.userData.mesh = model
      }
    })

  }

  matchPosition(id) {
    const object = this.objects[id]
    const box = this.boxes[id]

    object.mesh.position.y = box.y
    object.mesh.position.x = box.x
    object.mesh.position.z = box.z
    object.initialPosition.copy(object.mesh.position)
  }
}