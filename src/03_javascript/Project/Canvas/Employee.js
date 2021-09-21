import ExplorableObject from "./ExplorableObject"

export default class Employee extends ExplorableObject {
  constructor(mesh, box, number, step) {
    super(mesh, box, number, step)
  }

  setRotation(target, camera) {
    if(camera) {
      this.cameraRotation.y = Math.atan2(( camera.position.x - target.x ), ( camera.position.z - target.z ))
      this.cameraRotation.x = Math.PI*2
    }
  }

  setScale() {
    this.cameraScale.x = this.initialScale.x * this.progress * 2
    this.cameraScale.y = this.initialScale.y * this.progress * 2
    this.cameraScale.z = this.initialScale.z * this.progress * 2
  }

  rotate(t, scrollProgress) {
    const r = Math.PI * scrollProgress * 3
    this.mesh.rotation.set(
      this.cameraRotation.x * this.progress,
      this.cameraRotation.y * this.progress,
      t + this.number + r * Math.sin(this.number)
    )
  }
}