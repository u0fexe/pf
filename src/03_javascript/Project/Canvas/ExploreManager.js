import { Vector3 } from 'three'
import anime from 'animejs'

import scrollForce from "../../Library/Scroll/Force"
import scrollModel from "../../Library/Scroll/Model"
import bind from '../../Library/Utils/bind'
import loop from '../../Library/Tools/Loop'

export default class ExploreManager {
  constructor(explorableInterface, camera, categories) {
    bind(['onClick', 'backToExplosion', 'tick'], this)

    this.explorableInterface = explorableInterface
    this.camera = camera
    this.activeObject = null
    this.currentScroll = null

    this.concatObjects(categories)
    this.bindEvents()

    scrollForce.events.addListener('add', () => {
      if(!this.currentScroll) return;
      if(Math.abs(scrollForce.scrollValue.current - this.currentScroll) > 20) {
        this.backToExplosion()
      }
    })

    loop.add('exporeManager', this.tick)
  }

  concatObjects(categories) {
    this.objects = []

    categories.forEach(category => {
      this.objects = [...this.objects, ...category.objects]
    })
  }

  bindEvents() {
    this.objects.forEach(obj => obj.mesh.userData.onClick = this.onClick)
  }

  onClick(mesh) {
    const matchedObject = this.objects.find(object => object.mesh === mesh)
    if(this.activeObject && matchedObject.mesh.uuid === this.activeObject.mesh.uuid) return this.backToExplosion()
    if(this.activeObject && matchedObject.mesh.uuid !== this.activeObject.mesh.uuid) this.backToExplosion(false)

    this.activeObject = matchedObject
    this.currentScroll = scrollForce.scrollValue.current

    this.activeObject.outAnimation && this.activeObject.outAnimation.pause()

    this.explorableInterface.setContent(this.activeObject.data)

    this.activeObject.inAnimation = anime({
      targets: matchedObject,
      progress: [matchedObject.progress, 1],
      easing: this.activeObject.easing,
      update: () => matchedObject.show(this.camera)
    })
  }

  backToExplosion(hideContent = true) {
    const activeObject = this.activeObject

    this.activeObject = null
    this.currentScroll = null

    hideContent && this.explorableInterface.hide()
    const meshCameraPosition = new Vector3().copy(activeObject.cameraPosition)

    activeObject.inAnimation && activeObject.inAnimation.pause()
    activeObject.outAnimation = anime({
      targets: activeObject,
      progress: [activeObject.progress, 0],
      easing: activeObject.easing,
      update: () => activeObject.hide(meshCameraPosition)
    })
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
      scrollModel.scrollLength * 0.2
    ))
  }
}