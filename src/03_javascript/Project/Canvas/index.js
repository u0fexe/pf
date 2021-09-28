import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import Stats from 'three/examples/jsm/libs/stats.module.js'

import ThreeCanvas from '../../Library/Three/Canvas'
import Composer from '../../Library/Three/Composer'
import GrainPass from '../../Library/Three/GrainPass'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import scroll from '../../Library/Scroll'

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
import Player from './Player'
import ExplorableInterface from './ExplorableInterface'
import ExploreManager from './ExploreManager'
import Fog from './Fog'
import Particles from './Particles'
import Raycaster from './Raycaster'
import Team from './Team'
import CameraLight from './CameraLight'
import Redo from './Redo'

const stats = new Stats()
document.body.appendChild( stats.dom )

export default class Canvas extends ThreeCanvas {
  constructor(node) {
    super(node, {
      cameraZ: 2000,
      far: 30000
    })
    if(!this.node) return;

    this.createComposer()
    bind(['onProgress', 'onLoad'], this)
    this.load()

  }

  createComposer() {
    const params = {
      strength: 0.7,
      threshold: 0.26,
      radius: 1,
    }

    this.composer = new Composer(this.renderer, this.camera, this.scene)
    this.composer.resize(this.size.width, this.size.height)

    this.grainPass = new GrainPass()
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( innerWidth, innerHeight ), params.strength, params.radius, params.threshold )

    this.composer.addPass(this.bloomPass)
    this.composer.addPass(this.grainPass.pass)
  }

  resize() {
    super.resize()
    this.composer && this.composer.resize(this.size.width, this.size.height)
  }

  load() {
    this.loader = new Loader(this.onProgress, this.onLoad)
  }

  onProgress(_, loaded, total) {
    const progress = loaded / total
    document.documentElement.style.setProperty('--loading', progress)
  }

  onLoad() {

    this.train()
    this.redo()
    this.raycaster()
    this.fog()
    this.pointLights()
    this.ambientLight()
    this.player()
    this.explorableInterface()
    this.cases()
    this.team()
    this.yarBox()
    this.yarBoxLid()
    this.yarBoxSmoke()
    this.cameraMan()
    this.cameraLight()
    this.models()
    this.particles()
    this.exploreManager()
    this.activate()
    scroll.resize()

    setTimeout(() => {
      document.documentElement.classList.add('loaded')
    }, 0)

    setTimeout(() => {
      document.documentElement.classList.add('ready')
    }, 2000)
  }

  train() {
    this.train = new Train(this.camera)
    this.scene.add(this.train.group)
  }

  cameraMan() {
    this.cameraMan = new CameraMan(this.camera, this.yarBox)
  }

  redo() {
    this.redo = new Redo(this.train.group)
  }

  raycaster() {
    this.raycaster = new Raycaster(this.scene, this.camera)
  }

  fog() {
    this.fog = new Fog(this.scene)
  }

  ambientLight() {
    this.ambientLight = new AmbientLight()
    this.scene.add(this.ambientLight.mesh)
  }

  pointLights() {
    this.pointLights = new PointLights()
    this.train.addPassengers(this.pointLights.meshes)
  }

  player() {
    this.player = new Player(this.camera)
  }

  explorableInterface() {
    this.explorableInterface = new ExplorableInterface(this.player)
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
    this.raycaster.add(this.yarBox.mesh)
  }

  yarBoxSmoke() {
    this.yarBoxSmoke = new YarBoxSmoke(this.loader.assets.particles.smoke, this.yarBox, this.camera)
    this.yarBoxSmoke.start()
    this.redo.add(this.yarBoxSmoke)
  }

  yarBoxLid() {
    this.yarBoxLid = new YarBoxLid(this.loader.assets.yarBox, this.yarBox)
    this.train.addPassenger(this.yarBoxLid.mesh)
  }

  cameraLight() {
    this.cameraLight = new CameraLight()
    this.cameraLight.addTo(this.scene)
  }

  models() {
    this.models = new Models(this.loader.assets.models)
    this.models.addTo(this.train.group)
    this.models.addTo(this.raycaster)
  }

  particles() {
    const dotParticles = new Particles({ texture: this.loader.assets.particles.dot, colors: ['#ff00c6', '#ffffff', '#ff9800'] })
    dotParticles.start()
    this.redo.add(dotParticles)

    this.loader.assets.particles.sakura.forEach((texture, i) => {
      const particles = new Particles({
        texture,
        colors: ['#ff0000', '#e5ea00'],
        count: 20,
        size: 20,
        frequencyMultimplier: 0.1 + i / 10,
        xMultimplier: 3,
        zMultiplier: 3,
        opacity: 0.3
      })
      particles.start()
      this.redo.add(particles)
    })
  }

  exploreManager() {
    this.exploreManager = new ExploreManager(this.explorableInterface, this.camera, [
      this.cases,
      this.team,
      this.models
    ])
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
    this.train.move(t)
    this.grainPass.tick(t)
    this.composer.tick()
    stats.update()
  }
}