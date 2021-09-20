import * as THREE from 'three'
import resizer from '../Tools/Resizer.js'

export default class ThreeCanvas {
  constructor(node, options = {}) {
    if(!node) return;

    this.node = node
    this.options = { cameraZ: 2000, near: 1, far: 2000, ...options }
    this.size = { width: 0, height: 0 }

    this.create()
    resizer.add('canvas', 'resize', this, true)
  }

  create() {
    this.size.width = this.node.offsetWidth
    this.size.height = this.node.offsetHeight
    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
    this.node.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(40, this.size.width / this.size.height, this.options.near, this.options.far)
    this.camera.position.z = this.options.cameraZ
    this.camera.userData.z = this.options.cameraZ
    this.camera.fov = 2 * Math.atan((this.size.height / 2) / this.options.cameraZ) * (180 / Math.PI)
  }

  resize() {
    this.size.width = this.node.offsetWidth
    this.size.height = this.node.offsetHeight
    this.renderer.setSize(this.size.width, this.size.height)
		this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.camera.aspect = this.size.width / this.size.height
    this.camera.fov = 2 * Math.atan((this.size.height / 2) / this.options.cameraZ) * (180 / Math.PI)
    this.camera.updateProjectionMatrix()
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }
}