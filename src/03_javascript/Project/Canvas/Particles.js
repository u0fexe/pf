import { BufferGeometry, Points, Float32BufferAttribute, ShaderMaterial, AdditiveBlending, Color } from 'three'

import scrollModel from "../../Library/Scroll/Model"
import scrollForce from '../../Library/Scroll/Force'

import vertexShader from '../../../04_shaders/particles/vertex.glsl'
import fragmentShader from '../../../04_shaders/particles/fragment.glsl'
import loop from '../../Library/Tools/Loop'
import randomFromArray from '../../Library/Utils/randomFromArray'

let id = 0

export default class Particles {
  constructor(params) {
    this.params = {
      count: 100,
      size: 1,
      xMultimplier: 2,
      yMultimplier: 1,
      zMultimplier: 1.5,
      frequencyMultimplier: 0.1,
      texture: null,
      opacity: 1,
      colors: ['#ffffff'],
      ...params
    }

    this.id = id++
    this.create()

    loop.add('particles' + this.id, 'tick', this)
  }

  create() {
    const geometry = new BufferGeometry()
    const vertices = []
    const colors = []
    const sizes = []

    const color = new Color()
    const frequency = -Math.PI * (this.params.count * this.params.frequencyMultimplier)
    for ( let i = 0; i < this.params.count; i ++ ) {
      const step = (i / this.params.count)

      const x = Math.cos(step * frequency) * innerWidth * this.params.xMultimplier * step
      const y = -scrollModel.scrollLength + (scrollModel.scrollLength + innerHeight) * step * this.params.yMultimplier
      const z = Math.sin(step * frequency) * ((innerHeight + innerWidth) * this.params.zMultimplier) * step

      color.set(randomFromArray(this.params.colors))
      colors.push(color.r, color.g, color.b)

      vertices.push(x, y, z)

      sizes.push(this.params.size)
    }

    geometry.setAttribute('color', new Float32BufferAttribute( colors, 3 ))
    geometry.setAttribute('position', new Float32BufferAttribute( vertices, 3 ))
    geometry.setAttribute('size', new Float32BufferAttribute( sizes, 1 ))

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uScrollLength: { value: scrollModel.scrollLength },
        uTexture: { value: this.params.texture },
        uOpacity: { value: this.params.opacity },
      },
      depthWrite: false,
      transparent: true,
      vertexColors: true,
      blending: AdditiveBlending,
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