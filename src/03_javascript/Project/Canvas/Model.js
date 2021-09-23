import scrollForce from "../../Library/Scroll/Force"
import ExplorableObject from "./ExplorableObject"

export default class Model extends ExplorableObject {
  constructor(mesh, box, number, step) {
    super(mesh, box, number, step)
    this.easing = 'spring(3, 50, 20, 0)'
  }

  setRotation() {
    this.cameraRotation.y = -this.mesh.parent.rotation.y % Math.PI
    this.cameraRotation.x = Math.PI * 2
  }

  rotate(t, scrollProgress) {
    const r = Math.PI * scrollProgress * 3
    this.mesh.rotation.set(
      Math.cos(t * 0.3 + this.number) * r * (1 - this.progress),
      this.cameraRotation.y * this.progress,
      Math.cos(t * 0.3 + this.number) * r,
    )
  }

  translate(scrollProgress, scrollLength, boxOffset) {
    scrollProgress = scrollProgress * scrollProgress
    this.movedPosition.x = this.initialPosition.x - this.initialPosition.x * 0.95 * (1 - scrollProgress)
    this.movedPosition.y = this.initialPosition.y * scrollProgress + -scrollLength + scrollLength * scrollProgress
    this.movedPosition.z = this.initialPosition.z * scrollProgress

    this.mesh.position.x = this.movedPosition.x + this.cameraPosition.x
    this.mesh.position.y = this.movedPosition.y + this.cameraPosition.y
    this.mesh.position.z = this.movedPosition.z + this.cameraPosition.z
  }
}