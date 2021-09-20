import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export default class GrainPass {
  constructor() {
    this.pass = new ShaderPass({
      uniforms: {
        "tDiffuse": { value: null },
        "amount": { value: 0 }
      },
      vertexShader,
      fragmentShader,
    })

    this.pass.renderToScreen = true
  }

  tick(t) {
    this.pass.material.uniforms.amount.value = t * 0.00000001
  }
}