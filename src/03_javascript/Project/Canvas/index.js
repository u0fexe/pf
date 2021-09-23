import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import * as dat from 'dat.gui'

import ThreeCanvas from '../../Library/Three/Canvas'
import Composer from '../../Library/Three/Composer'
import GrainPass from '../../Library/Three/GrainPass'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import loop from '../../Library/Tools/Loop'
import bind from '../../Library/Utils/bind'

import Loader from './Loader'
import CameraMan from './CameraMan'
import Train from './Train'
import Cases from './Cases'
import PointLights from './PointLights'
import AmbientLight from './AmbientLight'
import YarBoxSmoke from './YarBoxSmoke'
import YarBoxLid from './YarBoxLid'
import YarBox from './YarBox'
import Models from './Models'
import ExplorableInterface from './ExplorableInterface'
import ExploreManager from './ExploreManager'
import Fog from './Fog'
import Particles from './Particles'
import Raycaster from './Raycaster'
import MouseLight from './MouseLight'
import scrollModel from '../../Library/Scroll/Model'
import Team from './Team'
import CameraLight from './CameraLight'
import BottomLight from './BottomLight'

const gui = new dat.GUI()
const stats = new Stats()
document.body.appendChild( stats.dom )

export default class Canvas extends ThreeCanvas {
  constructor(node) {
    super(node, {
      cameraZ: 2000,
      far: 30000
    })
    if(!this.node) return;

    scrollModel.prevents.push(gui.domElement)

    this.createComposer()
    bind(['onProgress', 'onLoad'], this)
    this.load()

    // this.renderer.shadowMap.enabled = true
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  createComposer() {
    const params = {
      strength: 1,
      threshold: 0.5,
      radius: 1,
    }

    this.composer = new Composer(this.renderer, this.camera, this.scene)
    this.composer.resize(this.size.width, this.size.height)

    this.grainPass = new GrainPass()
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( innerWidth, innerHeight ), params.strength, params.radius, params.threshold )

    this.composer.addPass(this.bloomPass)
    this.composer.addPass(this.grainPass.pass)

    const folder = gui.addFolder('bloomPass')

    folder.add( params, 'threshold', 0.0, 1.0, 0.01 ).onChange(( value ) => {
      this.bloomPass.threshold = Number( value )
    })

    folder.add( params, 'strength', 0.0, 3.0 ).onChange(( value ) => {
      this.bloomPass.strength = Number( value )
    })

    folder.add( params, 'radius', 0.0, 1.0 ).step( 0.01 ).onChange(( value ) => {
      this.bloomPass.radius = Number( value )
    })
  }

  resize() {
    super.resize()
    this.composer && this.composer.resize(this.size.width, this.size.height)
  }

  load() {
    this.loader = new Loader(this.onProgress, this.onLoad)
  }

  onProgress() {

  }

  onLoad() {
    this.train()
    this.cameraMan()
    this.raycaster()
    this.fog()
    this.pointLights()
    this.ambientLight()
    // this.mouseLight()
    this.explorableInterface()
    this.cases()
    this.team()
    this.yarBox()
    this.yarBoxLid()
    this.yarBoxSmoke()
    // this.bottomLight()
    this.cameraLight()
    this.models()
    this.particles()
    this.exploreManager()
    this.activate()
    // this.controls()

    document.documentElement.classList.add('loaded')
    document.documentElement.classList.add('ready')

    // setTimeout(() => {
    //   document.documentElement.classList.add('loaded')
    // // }, 10000)
    // }, 0)

    // setTimeout(() => {
    //   document.documentElement.classList.add('ready')
    // // }, 13000)
    // }, 3000)
  }

  train() {
    this.train = new Train(this.camera)
    this.scene.add(this.train.group)
  }

  cameraMan() {
    this.cameraMan = new CameraMan(this.camera)
  }

  raycaster() {
    this.raycaster = new Raycaster(this.scene, this.camera)
  }

  fog() {
    this.fog = new Fog(this.scene)
    this.fog.gui(gui)
  }

  ambientLight() {
    this.ambientLight = new AmbientLight()
    this.scene.add(this.ambientLight.mesh)
    this.ambientLight.gui(gui)
  }

  pointLights() {
    this.pointLights = new PointLights()
    this.train.addPassengers(this.pointLights.meshes)
    // this.pointLights.helpers(this.scene)
  }

  explorableInterface() {
    this.explorableInterface = new ExplorableInterface()
    this.explorableInterface.addTo(this.scene)
    this.explorableInterface.addTo(this.raycaster)
  }

  cases() {
    this.cases = new Cases(this.loader.assets.cases)
    this.cases.addTo(this.train.group)
    this.cases.addTo(this.raycaster)
  }

  team() {
    this.team = new Team(this.loader.assets.team)
    this.team.addTo(this.train.group)
    this.team.addTo(this.raycaster)
  }

  yarBox() {
    this.yarBox = new YarBox(this.loader.assets)
    this.train.addPassenger(this.yarBox.mesh)
    this.raycaster.add(this.yarBox.links.map(link => link.mesh))
    // this.yarBox.gui(gui)
  }

  yarBoxSmoke() {
    this.yarBoxSmoke = new YarBoxSmoke(this.loader.assets.particles.smoke, this.yarBox, this.camera)
    this.train.addPassenger(this.yarBoxSmoke.mesh)
    // this.yarBoxSmoke.gui(gui)
  }

  yarBoxLid() {
    this.yarBoxLid = new YarBoxLid(this.loader.assets.yarBox, this.yarBox)
    this.train.addPassenger(this.yarBoxLid.mesh)
  }

  bottomLight() {
    this.bottomLight = new BottomLight(this.yarBox.box)
    this.bottomLight.addTo(this.train.group)
    this.bottomLight.gui(gui)
  }

  cameraLight() {
    this.cameraLight = new CameraLight()
    this.cameraLight.addTo(this.scene)
    this.cameraLight.gui(gui)
  }

  models() {
    this.models = new Models(this.loader.assets.models)
    this.models.addTo(this.train.group)
    this.models.addTo(this.raycaster)
  }

  particles() {
    const dotParticles = new Particles({ texture: this.loader.assets.particles.dot, colors: ['#ff00c6', '#ffffff', '#ff9800'] })
    dotParticles.addTo(this.train.group)

    this.loader.assets.particles.autumn.forEach((texture, i) => {

      const particles = new Particles({
        texture,
        colors: ['#ff00c6', '#ffffff', '#ff9800'],
        count: 40,
        size: 25,
        frequencyMultimplier: 0.1 + i / 10,
        xMultimplier: 3,
        zMultiplier: 3,
        opacity: 0.3
      })

      particles.addTo(this.train.group)
    })
  }

  exploreManager() {
    this.exploreManager = new ExploreManager(this.explorableInterface, this.camera, [
      this.cases,
      this.team,
      this.models
    ])
  }

  mouseLight() {
    this.mouseLight = new MouseLight(this.camera, this.train)
    this.mouseLight.addOnScene(this.scene)
    // this.mouseLight.helpers(this.scene)
    // this.mouseLight.gui(gui)
  }

  controls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
  }

  activate() {
    if(!this.node) return;
    loop.add('canvas', 'tick', this)
  }

  deactivate() {
    loop.remove('canvas')
  }

  tick(t) {
    // this.controls.update()
    this.train.move(t)
    this.grainPass.tick(t)
    this.composer.tick()
    stats.update()
  }
}