import * as THREE from 'three'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

export default class Composer {
  constructor(renderer, camera, scene) {
    this.self = null
    this.RenderTargetClass = null
    this.renderTarget = null
    this.setRenderTargetClass(renderer)
    this.createRenderTarget()
    this.createSelf(renderer)
    this.addSMAAPass(renderer)
    this.addRenderPass(scene, camera)
  }

  createSelf(renderer) {
    this.self = new EffectComposer(renderer, this.renderTarget)
  }

  setRenderTargetClass(renderer) {
    this.RenderTargetClass = null
		if(renderer.getPixelRatio() === 1 && renderer.capabilities.isWebGL2)
			this.RenderTargetClass = THREE.WebGLMultisampleRenderTarget
		else
			this.RenderTargetClass = THREE.WebGLRenderTarget
  }

  createRenderTarget() {
    this.renderTarget = new this.RenderTargetClass(
      800,
      600,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      }
		)
  }

  addSMAAPass(renderer) {
    if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
			this.addPass(new SMAAPass())
		}
  }

  addRenderPass(scene, camera) {
		this.addPass(new RenderPass(scene, camera))
  }

  resize(width, height) {
		this.self.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.self.setSize(width, height)
  }

  addPass(pass) {
		this.self.addPass(pass)
  }

  tick() {
    this.self.render()
  }
}