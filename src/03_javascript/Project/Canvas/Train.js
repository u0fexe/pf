import { Group } from 'three'
import scrollForce from '../../Library/Scroll/Force'
import scrollModel from '../../Library/Scroll/Model'

export default class Train {
  constructor(camera) {
    this.group = new Group()
    this.camera = camera

    this.group.userData.z = -4000
    this.startZ = this.camera.userData.z - this.group.userData.z
    this.progress = 0
  }

  addPassenger(obj3D) {
    this.group.attach(obj3D)
  }

  addPassengers(objs3D) {
    objs3D.forEach(obj3D => this.addPassenger(obj3D))
  }

  move() {
    if(innerWidth < 1024) {
      this.mobileMove()
    } else {
      this.desktopMove()
    }
  }

  mobileMove() {
    this.progress = scrollForce.scrollValue.stopsDependentInterpolated / scrollModel.scrollLength
    this.group.position.y = scrollModel.scrollLength * (1 - this.progress *  this.progress * this.progress * this.progress )
    this.group.position.z = this.group.userData.z * this.progress
    this.group.rotation.y = this.progress * Math.PI * 5
  }

  desktopMove() {
    this.progress = scrollForce.scrollValue.stopsDependentInterpolated / scrollModel.scrollLength
    this.group.position.y = scrollModel.scrollLength * (1 - this.progress *  this.progress * this.progress * this.progress )
    this.group.position.z = this.group.userData.z * this.progress - 200 * Math.sin(this.progress * Math.PI * 2.2)
    this.group.rotation.y = this.progress * Math.PI * 5
    this.group.rotation.x = Math.sin(this.progress * Math.PI * 2.2) * 0.1
  }
}