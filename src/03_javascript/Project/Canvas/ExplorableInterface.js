import { Box3, Group, ShaderMaterial, Vector2, Vector3 } from 'three'
import { Text } from 'troika-three-text'
import anime from 'animejs'

import scrollModel from '../../Library/Scroll/Model'

import vertexShader from '../../../04_shaders/explore/vertex.glsl'
import fragmentShader from '../../../04_shaders/explore/fragment.glsl'

import getSize from '../../Library/Three/Helpers/getSize'
import loop from '../../Library/Tools/Loop'
import lerp from '../../Library/Utils/lerp'

export default class ExplorableInterface {
  constructor() {
    this.progress = {
      active: 0,
    }

    this.mouse = {
      z: 0,
    }

    this.active = false
    this.createElements()
    this.createContent()
  }

  createElements() {
    this.elements = {
      name: {
        box: scrollModel.boxes.find(box => box.name === 'exploreName'),
        mesh: null
      },
      description: {
        box: scrollModel.boxes.find(box => box.name === 'exploreDescription'),
        mesh: null
      },
      link: {
        box: scrollModel.boxes.find(box => box.name === 'exploreLink'),
        mesh: null
      },
    }

    this.elements.name.box.events.addListener('resize', this.resize.bind(this))
  }

  createContent() {
    this.group = new Group()

    const createMaterial = (color) => {
      return new ShaderMaterial({
        depthTest: false,
        transparent: true,
        vertexShader,
        fragmentShader,
        uniforms: {
          uActive: { value: 0 },
          uDeform: { value: 0 },
          uTime: { value: 0 },
          uColor: { value: new Vector3(...color) },
          uEnter: { value: 0 },
        }
      })
    }

    this.elements.name.mesh = new Text()
    this.elements.name.mesh.material = createMaterial([1.0, 0.709, 0.0])
    this.elements.name.mesh.font = 'multimedia/fonts/Oswald/Oswald-Bold.ttf'
    this.elements.name.mesh.text = ''
    this.elements.name.mesh.anchorX = 'center'
    this.elements.name.mesh.fontSize = 50
    this.elements.name.mesh.overflowWrap = 'break-word'
    this.elements.name.mesh.sync()

    this.elements.description.mesh = new Text()
    this.elements.description.mesh.material = createMaterial([0.8, 0.8, 0.8])
    this.elements.description.mesh.font = 'multimedia/fonts/Oswald/Oswald-Bold.ttf'
    this.elements.description.mesh.text = ''
    this.elements.description.mesh.fontSize = 20
    this.elements.description.mesh.overflowWrap = 'break-word'
    this.elements.description.mesh.sync()

    this.elements.link.mesh = new Text()
    this.elements.link.mesh.material = createMaterial([0.8, 0.8, 0.8])
    this.elements.link.mesh.font = 'multimedia/fonts/Oswald/Oswald-Bold.ttf'
    this.elements.link.mesh.text = ''
    this.elements.link.mesh.anchorX = 'center'
    this.elements.link.mesh.fontSize = 40
    this.elements.link.mesh.overflowWrap = 'break-word'
    this.elements.link.mesh.sync()
    this.elements.link.mesh.userData.onClick = this.onLinkClick.bind(this)
    this.elements.link.mesh.userData.onMouseMove = this.onMouseMove.bind(this)
    this.elements.link.mesh.userData.onMouseEnter = this.onMouseEnter.bind(this)
    this.elements.link.mesh.userData.onMouseLeave = this.onMouseLeave.bind(this)

    this.group.add(this.elements.name.mesh)
    this.group.add(this.elements.description.mesh)
    this.group.add(this.elements.link.mesh)

    this.resize()
  }

  setContent(data) {

    const show = (duration) => {
      for(const member in this.elements) {
        const element = this.elements[member]
        const elementData = data[member] || {}

        element.mesh.text = elementData.text

        if(elementData.href) {
          element.href = elementData.href
        }
      }

      this.resize()
      this.show(duration)
    }

    if(this.active) {
      this.hide(show, 700)
    } else {
      show()
    }
  }

  updateMouse(t) {
    this.mouseElement.material.uniforms.uEnter.value = lerp(this.mouseElement.material.uniforms.uEnter.value, this.mouse.z, 0.1)
  }

  onMouseEnter(object) {
    if(!this.active) return;
    this.mouseElement = object
    this.mouse.z = 1
    root.style.cursor = 'pointer'
    loop.add('explorableMouse', 'updateMouse', this)
  }

  onMouseLeave() {
    this.mouse.z = 0
    root.style.cursor = ''
    loop.removeAfterDelay('explorableMouse')
  }

  onMouseMove(s, c, uv) {
    if(!this.active) return;
    this.mouse.x = uv.x
    this.mouse.y = uv.y
  }

  onLinkClick() {
    if(!this.active) return;

    if(this.elements.link.href) {
      open(this.elements.link.href, '_blank').focus()
    }
  }

  updateMaterials(uniform, value) {
    for(const member in this.elements) {
      const element = this.elements[member]
      if(!this.elements[member].mesh.text) continue;

      element.mesh.material.uniforms[uniform].value = value
    }
  }

  visibility(value) {
    this.active = value
    // for(const member in this.elements) {
    //   const element = this.elements[member]
    //   element.mesh.visible = value
    // }
  }

  show(duration = 1500) {
    this.visibility(true)

    anime({
      targets: this.progress,
      active: [this.progress.active, 1],
      duration: duration,
      easing: 'easeInOutExpo',
      update: () => {
        this.updateMaterials('uActive', this.progress.active)
        this.updateMaterials('uDeform', (1 - this.progress.active))
      }
    })
  }

  hide(cb, duration = 1500) {
    anime({
      targets: this.progress,
      active: [this.progress.active, 0],
      duration: duration,
      easing: 'easeInOutExpo',
      update: () => {
        this.updateMaterials('uActive', this.progress.active)
        this.updateMaterials('uDeform', (1 - this.progress.active))
      },
      complete: () => {
        this.visibility(false)
        cb && cb(duration)
      }
    })
  }

  addTo(container) {
    container.add(this.group)
  }

  resize() {
    setTimeout(() => {
      this.elements.description.mesh.position.set(this.elements.description.box.x - this.elements.description.box.width/2, this.elements.description.box.y + getSize(this.elements.description.mesh).y/2, 0)
      this.elements.description.mesh.maxWidth = this.elements.description.box.width

      this.elements.name.mesh.position.set(this.elements.name.box.x, this.elements.name.box.y + getSize(this.elements.name.mesh).y/2, 0)
      this.elements.link.mesh.position.set(this.elements.link.box.x, this.elements.link.box.y + getSize(this.elements.link.mesh).y/2, 0)

    }, 200)
  }
}