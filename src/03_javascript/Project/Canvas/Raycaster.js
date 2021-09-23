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

  callback(intersection, name) {

    if(this[intersection]) {
      const object = this[intersection].object.userData.mesh ? this[intersection].object.userData.mesh : this[intersection].object
      object.userData[name] &&
      object.userData[name](object, this.camera, this[intersection].uv)
    }
  }

  compare(intersection) {
    return intersection && (!this.prevIntersection || intersection.object.uuid !== this.prevIntersection.object.uuid)
  }

  onMouseMove( event ) {
    this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

    this.raycaster.setFromCamera( this.mouse, this.camera )

    this.intersects = this.raycaster.intersectObjects(this.intersectObjects, true)
    this.currentIntersection = this.intersects[0]

    this.callback('currentIntersection', 'onMouseMove')

    if(!this.mouseEntered && this.compare(this.intersects[0])) {
      this.mouseEntered = true
      this.currentIntersection = this.intersects[0]
      this.callback('currentIntersection', 'onMouseEnter')
    }

    else if (this.mouseEntered && (!this.intersects[0] || this.compare(this.intersects[0]))) {
      this.mouseEntered = false
      this.callback('prevIntersection', 'onMouseLeave')
    }

    this.prevIntersection = this.currentIntersection
  }

  onMouseClick() {
    this.callback('currentIntersection', 'onClick')
  }
}
