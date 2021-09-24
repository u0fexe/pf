import resizer from '../../Library/Tools/Resizer'

export default class Redo {
  constructor(scene) {
    this.scene = scene
    this.instances = []
    resizer.add('canvasredo', 'resize', this)
  }

  add(instance) {
    this.instances.push(instance)
    this.scene.add(instance.mesh)
  }

  resize() {
    this.instances.forEach(instance => {
      if(!instance.mesh) return;

      instance.mesh.material.dispose()
      instance.mesh.geometry.dispose()

      this.scene.remove(instance.mesh)
      instance.construct && instance.construct()
      this.scene.add(instance.mesh)
    })
  }
}