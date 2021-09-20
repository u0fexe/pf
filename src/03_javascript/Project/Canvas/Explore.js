import { Vector3 } from 'three'
import anime from 'animejs'

import scrollForce from "../../Library/Scroll/Force"
import scrollModel from "../../Library/Scroll/Model"
import bind from '../../Library/Utils/bind'

import SceneObjects from '../../Library/Three/SceneObjects'

export default class Explore extends SceneObjects {
  constructor(name) {
    super(name)

    this.activeObject = null
    this.currentScroll = null
    this.objects = []

    bind(['onClick', 'onScroll'], this)

    scrollForce.events.addListener('add', () => {
      if(!this.currentScroll) return;
      if(Math.abs(scrollForce.scrollValue.current - this.currentScroll) > 100) {
        this.onScroll()
      }
    })
  }

  onClick(mesh, camera) {
    const matchedObject = this.objects.find(object => object.mesh === mesh)
    if(this.activeObject && matchedObject.mesh.uuid !== this.activeObject.mesh.uuid) this.onScroll()

    this.activeObject = matchedObject
    this.currentScroll = scrollForce.scrollValue.current

    this.activeObject.outAnimation && this.activeObject.outAnimation.pause()

    this.activeObject.inAnimation = anime({
      targets: matchedObject,
      progress: [matchedObject.progress, 1],
      easing: 'easeInOutCubic',
      duration: 1500,
      update: () => matchedObject.show(camera)
    })
  }

  onScroll() {
    const activeObject = this.activeObject

    this.activeObject = null
    this.currentScroll = null

    const meshCameraPosition = new Vector3().copy(activeObject.cameraPosition)

    activeObject.inAnimation && activeObject.inAnimation.pause()
    activeObject.outAnimation = anime({
      targets: activeObject,
      progress: [activeObject.progress, 0],
      easing: 'easeInOutCubic',
      duration: 1500,
      update: () => activeObject.hide(meshCameraPosition)
    })
  }

  resize(id) {
    super.resize(id)
    this.objects[id].resizeContent()
  }

  matchPosition(id) {
    const object = this.objects[id]
    const box = this.boxes[id]

    object.mesh[id].position.y = box[id].y
    object.mesh[id].position.x = box[id].x
    object.mesh[id].position.z = box[id].z
    this.objects[id].initialPosition.copy(this.objects[id].mesh.position)
  }

  matchSize(id) {
    this.objects[id].mesh.scale.set(this.boxes[id].width, this.boxes[id].height, (this.boxes[id].width + this.boxes[id].height) / 2)
    this.objects[id].initialScale.copy(this.objects[id].mesh.scale)
  }

  addTo(scene) {
    this.objects.forEach(object => {
      scene.add(object.mesh)
    })
  }

  tick(t) {
    t *= 0.0001

    this.objects.forEach(object => object.tick(
      t,
      scrollForce.scrollValue.interpolatedN,
      scrollModel.scrollLength,
      scrollModel.scrollLength * 0.15
    ))
  }
}