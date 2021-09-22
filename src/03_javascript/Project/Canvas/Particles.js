import { BufferGeometry, Points, Float32BufferAttribute, ShaderMaterial, AdditiveBlending } from 'three'

import scrollModel from "../../Library/Scroll/Model"
import scrollForce from '../../Library/Scroll/Force'

import vertexShader from '../../../04_shaders/particles/vertex.glsl'
import fragmentShader from '../../../04_shaders/particles/fragment.glsl'
import loop from '../../Library/Tools/Loop'

let id = 0

export default class Particles {
  constructor(params) {
    this.params = {
      count: 100,
      xMultimplier: 3,
      zMultimplier: 1.5,
      frequencyMultimplier: 0.1,
      colors: ['#b90007', '#ffc228', '#2bd0b5'],
      ...params
    }

    this.id = id++
    this.create()

    loop.add('particles' + this.id, 'tick', this)
  }

  create() {
    const geometry = new BufferGeometry()
    const vertices = []

    const frequency = -Math.PI * (this.params.count * this.params.frequencyMultimplier)
    for ( let i = 0; i < this.params.count; i ++ ) {
      const step = (i / this.params.count)

      const x = Math.cos(step * frequency) * innerWidth * this.params.xMultimplier * step
      const y = -scrollModel.scrollLength + (scrollModel.scrollLength + innerHeight) * step
      const z = Math.sin(step * frequency) * ((innerHeight + innerWidth) * this.params.zMultimplier) * step

      vertices.push( x, y, z )
    }

    geometry.setAttribute('position', new Float32BufferAttribute( vertices, 3 ) )

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uScrollLength: { value: scrollModel.scrollLength },
      },
      depthWrite: false,
      transparent: true,
      vertexColors: false
    })
    this.particles = new Points( geometry, material )
  }

  addTo(scene) {
    scene.add(this.particles)
  }

  tick(t) {
    t *= 0.0005
    const progress = scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN
    this.particles.material.uniforms.uProgress.value = progress
    this.particles.material.uniforms.uTime.value = t
    this.particles.material.uniforms.uScrollLength.value = scrollModel.scrollLength
  }
}