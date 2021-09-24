import scrollForce from "../../Library/Scroll/Force"
import ExplorableObject from "./ExplorableObject"

export default class Employee extends ExplorableObject {
  constructor(mesh, box, number, step) {
    super(mesh, box, number, step)
    this.easing = 'spring(2, 100, 30, 0)'
  }

  setRotation() {
    this.cameraRotation.y = -this.mesh.parent.rotation.y % Math.PI
    this.cameraRotation.x = Math.PI * 2
  }

  setScale() {
    this.cameraScale.x = this.initialScale.x * this.progress * 2
    this.cameraScale.y = this.initialScale.y * this.progress * 2
    this.cameraScale.z = this.initialScale.z * this.progress * 2
  }

  rotate(t, scrollProgress) {
    const r = Math.PI * scrollProgress * 3
    this.mesh.rotation.set(
      Math.cos(t * 0.3 + this.number) * r * (1 - this.progress),
      this.cameraRotation.y * this.progress,
      Math.cos(t * 0.3 + this.number) * r,
    )
  }

  tick(t, scrollProgress, scrollLength, boxOffset) {
    super.tick(t, scrollProgress, scrollLength, boxOffset)
    if(this.mesh.material.userData.shader) {
      this.mesh.material.userData.shader.uniforms.uTime.value = scrollForce.speed * 5.0 * (1 - this.progress)
      this.mesh.material.userData.shader.uniforms.uActive.value = (1 - this.progress)
    }
  }
}