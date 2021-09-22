import { BufferGeometry, Points, Float32BufferAttribute, ShaderMaterial } from 'three'

import scrollModel from "../../Library/Scroll/Model"

import vertexShader from '../../../04_shaders/particles/vertex.glsl'
import fragmentShader from '../../../04_shaders/particles/fragment.glsl'

export default class CurveSparkles {
  constructor(params) {
    this.params = {
      count: 100,
      xMultimplier: 0.5,
      zMultimplier: 0.5,
      frequencyMultimplier: 0.5,
      colors: ['#b90007', '#ffc228', '#2bd0b5'],
      ...params
    }

    this.create()
  }

  create() {
    const geometry = new BufferGeometry();
    const vertices = []

    const frequency = Math.PI * this.params.count * this.params.frequencyMultimplier
    for ( let i = 0; i < this.params.count; i ++ ) {
      const step = (i / this.params.count)
      const minimizer = (i / this.params.count) * 0.6 + 0.4

      const x = Math.cos(step * frequency) * innerWidth * this.params.xMultimplier * step
      const y = -scrollModel.scrollLength + scrollModel.scrollLength * step
      const z = Math.sin(step * frequency) * ((innerHeight + innerWidth) * this.params.zMultimplier) * minimizer

      vertices.push( x, y, z )
    }

    geometry.setAttribute('position', new Float32BufferAttribute( vertices, 3 ) )

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 }
      }
    })
    material.color.setHSL( 1.0, 0.3, 0.7 )
    this.particles = new Points( geometry, material )
  }

  addTo(scene) {
    scene.add(this.particles)
  }

  tick(t) {
    t *= 0.0005

    const progress = scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN
    const length = scrollModel.scrollLength

    this.particles.material.uniforms.uProgress.value = progress
  }
}