import { Vector3 } from 'three'
import bind from '../../Library/Utils/bind'

export default class ExplorableObject {
  constructor(mesh, box, number = 1, step = 1) {
    bind(['show', 'hide'], this)

    this.mesh = mesh
    this.box = box
    this.node = this.box.node

    this.number = number
    this.step = step
    this.progress = 0
    this.initialPosition = new Vector3()
    this.initialScale = new Vector3()
    this.cameraPosition = new Vector3()
    this.movedPosition = new Vector3()
    this.cameraScale = new Vector3()
    this.cameraRotation = new Vector3()

    this.findData()
  }

  findData() {
    const nameElement = this.node.querySelector('[data-name]')
    const descriptionElement = this.node.querySelector('[data-description]')
    const linkElement = this.node.querySelector('[data-link]')

    this.data = {}

    if(nameElement) {
      this.data.name = {
        text: nameElement.textContent.trim(),
      }
    }

    if(descriptionElement) {
      this.data.description = {
        text: descriptionElement.textContent.trim(),
      }
    }

    if(linkElement) {
      this.data.link = {
        text: linkElement.textContent.trim(),
        href: linkElement.href
      }
    }
  }

  show(camera) {
    const target = new Vector3(0, 0, -camera.position.z * 0.9)
    target.applyMatrix4(camera.matrixWorld)
    this.mesh.parent.worldToLocal(target)

    this.setTranslation({
      x: target.x - this.movedPosition.x,
      y: target.y - this.movedPosition.y,
      z: target.z - this.movedPosition.z,
    })

    this.setScale()
    this.setRotation(camera)
  }

  hide(meshCameraPosition) {
    this.setTranslation(meshCameraPosition)
    this.setScale()
    this.setRotation()
  }

  setTranslation(vec3) {
    this.cameraPosition.x = vec3.x * this.progress
    this.cameraPosition.y = vec3.y * this.progress
    this.cameraPosition.z = vec3.z * this.progress
  }

  setScale() {
    this.cameraScale.x = this.initialScale.x * this.progress
    this.cameraScale.y = this.initialScale.y * this.progress
    this.cameraScale.z = this.initialScale.z * this.progress
  }

  setRotation() {
    this.cameraRotation.x = Math.PI  * this.progress
    this.cameraRotation.z = Math.PI  * this.progress
  }

  rotate(t, scrollProgress) {
    const r = Math.PI * scrollProgress * 3
    this.mesh.rotation.x = t + this.number + (r * Math.cos(this.number)) + this.cameraRotation.x
    this.mesh.rotation.z = t + this.number + (r * Math.sin(this.number)) + this.cameraRotation.z
  }

  translate(scrollProgress, scrollLength, boxOffset) {
    scrollProgress = scrollProgress * scrollProgress
    this.movedPosition.x = this.initialPosition.x - this.initialPosition.x * 0.95 * (1 - scrollProgress)
    this.movedPosition.y = -scrollLength + (boxOffset + scrollLength * this.step) * scrollProgress
    this.movedPosition.z = this.initialPosition.z * scrollProgress

    this.mesh.position.x = this.movedPosition.x + this.cameraPosition.x
    this.mesh.position.y = this.movedPosition.y + this.cameraPosition.y
    this.mesh.position.z = this.movedPosition.z + this.cameraPosition.z
  }

  scale() {
    this.mesh.scale.x = this.initialScale.x + this.cameraScale.x
    this.mesh.scale.y = this.initialScale.y + this.cameraScale.y
    this.mesh.scale.z = this.initialScale.z + this.cameraScale.z
  }

  tick(t, scrollProgress, scrollLength, boxOffset) {
    this.rotate(t, scrollProgress)
    this.translate(scrollProgress, scrollLength, boxOffset)
    this.scale()
  }
}