import { LoadingManager, TextureLoader, FontLoader, CubeTextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Loader {
  constructor(onProgress, onLoad) {
    this.loadingManager = new LoadingManager()
    this.loadingManager.onProgress = onProgress
    this.loadingManager.onLoad = onLoad

    this.textureLoader = new TextureLoader(this.loadingManager)
		this.fontLoader = new FontLoader(this.loadingManager)
    this.cubeTextureLoader = new CubeTextureLoader(this.loadingManager)
    this.gltfLoader = new GLTFLoader(this.loadingManager)

    this.assets = {
      cases: [],
      team: [],
      background: null,
      particles: {
        sakura: []
      },
      yarBox: {},
      models: {},
    }

    this.load()
  }

  load() {
    this.loadCases()
    this.loadTeam()
    this.loadParticle()
    this.loadYarBox()
    this.loadModels()
  }

  loadCases() {
    document.querySelectorAll('[data-case-src]').forEach(el =>
      this.textureLoader.load(el.getAttribute('data-case-src'), texture => {
        texture.userData = {}
        texture.userData.element = el
        this.assets.cases.push(texture)
      })
    )
  }

  loadTeam() {
    document.querySelectorAll('[data-employee-src]').forEach(el =>
      this.textureLoader.load(el.getAttribute('data-employee-src'), texture => {
        texture.userData = {}
        texture.userData.element = el
        this.assets.team.push(texture)
      })
    )
  }

  loadParticle() {
    this.textureLoader.load('multimedia/images/particles/smoke.png', texture => {
      this.assets.particles.smoke = texture
    })

    this.textureLoader.load('multimedia/images/particles/dot.jpg', texture => {
      this.assets.particles.dot = texture
    })

    this.textureLoader.load('multimedia/images/particles/sakura/petal1.png', texture => {
      this.assets.particles.sakura.push(texture)
    })

    this.textureLoader.load('multimedia/images/particles/sakura/petal2.png', texture => {
      this.assets.particles.sakura.push(texture)
    })

    this.textureLoader.load('multimedia/images/particles/sakura/petal3.png', texture => {
      this.assets.particles.sakura.push(texture)
    })

    this.textureLoader.load('multimedia/images/particles/sakura/petal4.png', texture => {
      this.assets.particles.sakura.push(texture)
    })
  }

  loadYarBox() {
    const box = document.querySelector('[data-scroll-box="yarBox"]')
    if(!box) return;

    const logo = box.getAttribute('data-logo')
    const cactus = box.getAttribute('data-cactus')
    this.textureLoader.load(logo, texture => {
      this.assets.yarBox.logo = texture
    })
    this.textureLoader.load(cactus, texture => {
      this.assets.yarBox.cactus = texture
    })
  }

  loadModels() {
    this.gltfLoader.load('multimedia/models/cactus1.glb', (gltf) => {
      this.assets.models.cactus1 = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/pencil1.glb', (gltf) => {
      this.assets.models.pencil1 = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/pencil2.glb', (gltf) => {
      this.assets.models.pencil2 = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/pencil3.glb', (gltf) => {
      this.assets.models.pencil3 = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/phone.glb', (gltf) => {
      this.assets.models.phone = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/whiskey.glb', (gltf) => {
      this.assets.models.whiskey = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/player.glb', (gltf) => {
      this.assets.models.player = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/gear.glb', (gltf) => {
      this.assets.models.gear = gltf.scene
    })

    this.gltfLoader.load('multimedia/models/clock.glb', (gltf) => {
      this.assets.models.clock = gltf.scene
    })
  }
}