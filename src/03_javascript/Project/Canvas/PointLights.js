import { AdditiveBlending, Color, CylinderBufferGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PointLight, ShaderMaterial, TorusGeometry, Vector3 } from 'three'
import SceneObjects from '../../Library/Three/SceneObjects'
import scrollModel from '../../Library/Scroll/Model'
import scrollForce from '../../Library/Scroll/Force'
import hex2rgb from '../../Library/Utils/hexToRgb'
import anime from 'animejs'

export default class PointLights extends SceneObjects {
  constructor() {
    super('pointLight')

    this.lightShapes = []
    this.lights = []
    this.lightsAnimation = {
      on: {
        duration: 2000,
        easing: 'easeOutElastic(1, .5)'
      },
      off: {
        duration: 1000,
        easing: 'easeInOutExpo',
      }
    }

    this.createMeshes()
    this.loopTrue()

    scrollModel.addClassTriggerListener('lampsOn', 'addProperty', () => {
      this.lampsOn()
    })

    scrollModel.addClassTriggerListener('lampsOn', 'removeProperty', () => {
      this.lampsOff()
    })
  }

  createMaterial(color, delayed) {
    const c = new Color()
    c.set(color)

    return new ShaderMaterial({
      vertexShader: `
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uActive;
        void main() {
          gl_FragColor = vec4(uColor, uActive);
        }
      `,
      uniforms: {
        uColor: { value: new Vector3(c.r, c.g, c.b) },
        uActive: { value: delayed ? 0.05 : 1 },
      },
      transparent: true,
      blending: AdditiveBlending
    })
  }

  createMeshes() {
    this.meshes = []

    for(let i = 0; i < this.boxes.length; i++) {
      const box = this.boxes[i]
      const node = box.node

      const color = node.getAttribute('data-color') || '#ffffff'
      const delayed = node.hasAttribute('data-delayed') || false
      const intensity = +node.getAttribute('data-intensity') || 1
      const distance = +node.getAttribute('data-distance') || 1000
      const decay = +node.getAttribute('data-decay') || 1
      const shape = node.getAttribute('data-shape')

      const group = new Group()

      const light = new PointLight(color, intensity, distance, decay)
      group.add(light)

      if(shape && delayed) {
        light.intensity = 0
        light.userData.intensity = intensity
        this.lights.push(light)
      }

      if(shape === 'torus') {
        group.add(this.getTorusShape(color, delayed))
      }

      else if(shape === 'lamp') {
        group.add(this.getLampShape(color, delayed))
      }

      this.meshes.push(group)
    }

    this.created = true
    for (let id = 0; id < this.meshes.length; id++) {
      this.resize(id)
    }
    this.events.notify('ready')
  }

  getTorusShape(color, delayed) {
    const geometry = new TorusGeometry( 1, 0.3, 16, 100 );
    const material = this.createMaterial(color, delayed)
    const shape = new Mesh(geometry, material)
    delayed && this.lightShapes.push(shape)
    return shape
  }

  getLampShape(color, delayed) {
    const shape = new Group()
    const lightGeometry = new CylinderBufferGeometry( 1, 1, 20, 32 )
    const lightMaterial = this.createMaterial(color, delayed)
    const lightPart = new Mesh( lightGeometry, lightMaterial )

    delayed && this.lightShapes.push(lightPart)

    const capGeometry = new CylinderBufferGeometry( 1, 1, 5, 32 )
    const capMaterial = new MeshStandardMaterial({color: 0x111111})
    const capPart1 = new Mesh( capGeometry, capMaterial )
    capPart1.position.y = -13
    const capPart2 = new Mesh( capGeometry, capMaterial )
    capPart2.position.y = 13

    shape.add(lightPart)
    shape.add(capPart1)
    shape.add(capPart2)

    return shape
  }

  addOnScene(scene) {
    super.addOnScene(scene)
  }

  matchPosition(id) {
    const mesh = this.meshes[id]
    const box = this.boxes[id]
    mesh.position.x = box.x
    mesh.position.y = box.y
    mesh.position.z = box.z
    mesh.userData.initialPosition = new Vector3().copy(mesh.position)
  }

  matchSize(id) {
    const mesh = this.meshes[id]
    const box = this.boxes[id]
    mesh.scale.set(box.width, box.height, (box.width + box.height) / 2)
  }

  lampsOn() {
    this.lightShapes.forEach((shape, i) => {
      shape.userData.onAnimation && shape.userData.onAnimation.pause()
      shape.userData.offAnimation && shape.userData.offAnimation.pause()

      shape.userData.onAnimation = anime({
        targets: shape.material.uniforms.uActive,
        value: [0.05, 1],
        delay: i * 300,
        ...this.lightsAnimation.on
      })
    })

    this.lights.forEach((light, i) => {
      light.userData.onAnimation && light.userData.onAnimation.pause()
      light.userData.offAnimation && light.userData.offAnimation.pause()
      light.userData.onAnimation = anime({
        targets: light,
        intensity: [0, light.userData.intensity],
        delay: i * 300,
        ...this.lightsAnimation.on
      })
    })
  }

  lampsOff() {
    this.lightShapes.forEach((shape, i) => {
      shape.userData.onAnimation && shape.userData.onAnimation.pause()
      shape.userData.offAnimation && shape.userData.offAnimation.pause()

      shape.userData.offAnimation = anime({
        targets: shape.material.uniforms.uActive,
        value: [1, 0.05],
        delay: i * 300,
        ...this.lightsAnimation.off
      })
    })

    this.lights.forEach((light, i) => {
      light.userData.onAnimation && light.userData.onAnimation.pause()
      light.userData.offAnimation && light.userData.offAnimation.pause()

      light.userData.offAnimation = anime({
        targets: light,
        intensity: [light.userData.intensity, 0],
        delay: i * 300,
        ...this.lightsAnimation.off
      })
    })
  }

  tick(t) {
    t *= 0.0005

    const progress = scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN * scrollForce.scrollValue.interpolatedN
    const length = scrollModel.scrollLength

    this.meshes.forEach((mesh, i) => {
      mesh.rotation.x = t + i
      mesh.position.y = mesh.userData.initialPosition.y * progress + -length + length * progress
      mesh.position.x = mesh.userData.initialPosition.x * progress
      mesh.position.z = mesh.userData.initialPosition.z * progress
    })
  }
}