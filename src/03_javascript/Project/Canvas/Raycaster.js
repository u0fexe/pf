import { Raycaster as THREERaycaster } from 'three'

export default class Raycaster {
  constructor(scene, camera) {
    this.raycaster = new THREERaycaster()
    this.mouse = { x: 0, y: 0 }

    addEventListener('mousemove', this.onMouseMove.bind(this))
    addEventListener('click', this.onMouseClick.bind(this))

    this.scene = scene
    this.camera = camera

    this.intersectObjects = []

    this.currentIntersection = null
  }

  add(object3ds) {
    object3ds = Array.isArray(object3ds) ? object3ds : [object3ds]
    this.intersectObjects = [...this.intersectObjects, ...object3ds]
  }

  onMouseMove( event ) {
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

    this.raycaster.setFromCamera( this.mouse, this.camera )

    this.intersects = this.raycaster.intersectObjects(this.intersectObjects, true)
    this.currentIntersection = this.intersects[0]
  }

  onMouseClick() {
    if(this.currentIntersection) {
      this.currentIntersection.object.userData.onClick && this.currentIntersection.object.userData.onClick(
        this.currentIntersection.object,
        this.camera
      )
    }
  }
}
