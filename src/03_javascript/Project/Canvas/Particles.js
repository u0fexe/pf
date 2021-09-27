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
      sizeProgress: false,
      opacityProgress: false,
      texture: null,
      opacity: 1,
      timeMiltiplier: 0.0005,
      colors: ['#ffffff'],
      ...params
    }

    this.id = id++
  }

  start() {
    this.construct()
    loop.add('particles' + this.id, 'tick', this)
  }

  construct() {
    const geometry = new BufferGeometry()
    const vertices = []
    const colors = []
    const sizes = []

    const color = new Color()
    const frequency = -Math.PI * (this.params.count * this.params.frequencyMultimplier)

    for ( let i = 0; i < this.params.count; i ++ ) {
      const step = (i / this.params.count)

      const { x, y, z } = this.generatePosition(step, frequency, scrollModel.scrollLength)

      color.set(randomFromArray(this.params.colors))
      colors.push(color.r, color.g, color.b)

      vertices.push(x, y, z)

      sizes.push(this.generateSize(step, frequency, scrollModel.scrollLength))
    }

    geometry.setAttribute('color', new Float32BufferAttribute( colors, 3 ))
    geometry.setAttribute('position', new Float32BufferAttribute( vertices, 3 ))
    geometry.setAttribute('size', new Float32BufferAttribute( sizes, 1 ))

    const material = this.generateMaterial()

    this.mesh = new Points( geometry, material )
  }

  generateMaterial() {

    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uScrollLength: { value: scrollModel.scrollLength },
        uTexture: { value: this.params.texture },
        uOpacity: { value: this.params.opacity },
        uSizeProgress: { value: 1 },
        uOpacityProgress: { value: 0 }
      },
      depthWrite: false,
      transparent: true,
      vertexColors: true,
      blending: AdditiveBlending,
    })

  }

  generatePosition(step, frequency, scrollLength) {
    const x = Math.cos(step * frequency) * innerWidth * this.params.xMultimplier * step
    const y = -scrollLength + (scrollLength + innerHeight) * step * this.params.yMultimplier
    const z = Math.sin(step * frequency) * ((innerHeight + innerWidth) * this.params.zMultimplier) * step

    return { x, y, z }
  }

  generateSize() {
    return this.params.size
  }

  tick(t) {
    t *= this.params.timeMiltiplier
    const progress = scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN
    this.mesh.material.uniforms.uProgress.value = progress
    this.mesh.material.uniforms.uTime.value = t
    this.mesh.material.uniforms.uScrollLength.value = scrollModel.scrollLength

    if(this.params.sizeProgress) {
      this.mesh.material.uniforms.uSizeProgress.value = progress
    }

    if(this.params.opacityProgress) {
      this.mesh.material.uniforms.uOpacityProgress.value = progress
    }
  }
}