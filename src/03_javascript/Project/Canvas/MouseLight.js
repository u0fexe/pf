import { Mesh, PointLight, PointLightHelper, SphereBufferGeometry, Vector3, ShaderMaterial, Group } from 'three'
import anime from 'animejs'
import MouseElement from '../../Library/Tools/MouseElement'
import scrollModel from '../../Library/Scroll/Model'

export default class MouseLight extends MouseElement {
  constructor(camera, train) {
    super(canvas, {
      ease: 0.1,
      fromCenter: true,
      resetOnLeave: true,
      notify: false,
    })

    this.params = {
      color: 0xffe27e,
      intensity: 2,
      distance: 8000,
      decay: 5.45
    }

    this.translate = {
      z: 0
    }

    this.progress = 0

    this.camera = camera
    this.train = train

    this.createMeshes()
    this.start()
  }

  createMeshes() {
    this.group = new Group()
    this.light = new PointLight(this.params.color, this.params.intensity, this.params.distance, this.params.decay)
    this.sphere = new Mesh(new SphereBufferGeometry(1, 20, 20), new ShaderMaterial({
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(4.0, 4.0, 0.8, 1);
        }
      `,

      vertexShader: `
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;

          gl_Position = projectedPosition;
        }
      `
    }))
    this.sphere.aoMapIntensity = 10
    this.group.add(this.light)
    this.group.add(this.sphere)
    this.group.scale.set(20, 20, 20)
    this.group.position.z = this.train.group.position.z
  }

  addOnScene(scene) {
    scene.add(this.group)
  }

  bringInFront() {
    anime({
      targets: this,
      progress: [this.progress, 1],
      easing: 'easeOutExpo',
      duration: 3000,
      update: () => {
        this.translate.z = (this.camera.position.z - this.train.group.position.z - this.camera.position.z * 0.8) * this.progress
      }
    })
  }

  bringBack() {
    const z = this.translate.z
    anime({
      targets: this,
      progress: [this.progress, 0],
      easing: 'easeInOutExpo',
      duration: 2000,
      update: () => {
        this.translate.z = z * this.progress
      }
    })
  }

  helpers(scene) {
    scene.add(new PointLightHelper(this.light, 1))
  }

  gui(gui) {
    const folder = gui.addFolder('mouseLight')

    folder.addColor(this.params, 'color').onChange((val) => {
      this.light.color.setHex(val)
    })

    folder.add(this.params, 'intensity', 0, 10, 0.01).onChange((val) => {
      this.light.intensity = val
    })

    folder.add(this.params, 'distance', 0, 20000, 0.1).onChange((val) => {
      this.light.distance = val
    })

    folder.add(this.params, 'decay', 0, 10, 0.01).onChange((val) => {
      this.light.decay = val
    })
  }

  tick() {
    super.tick()

    var vector = new Vector3(this.mouse.ix, this.mouse.iy, 0.5)
    vector.unproject(this.camera)
    var dir = vector.sub( this.camera.position ).normalize()
    var distance = - (this.camera.position.z - this.train.group.position.z - this.translate.z) / dir.z
    var pos = this.camera.position.clone().add( dir.multiplyScalar( distance ) )

    this.group.position.x = pos.x
    this.group.position.y = pos.y
    this.group.position.z = pos.z
  }
}