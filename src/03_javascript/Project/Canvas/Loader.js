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
      background: null,
      partciles: {
        smoke: null
      },
      yarBox: {
        logo: null,
        cactus: null,
      },
      models: {

      }
    }

    this.load()
  }

  load() {
    this.loadCases()
    this.loadSmoke()
    this.loadYarBox()
    this.loadModels()
  }

  loadCases() {
    document.querySelectorAll('[data-case-src]').forEach(el =>
      this.textureLoader.load(el.getAttribute('data-case-src'), texture => {
        this.assets.cases.push(texture)
      })
    )
  }

  loadSmoke() {
    this.textureLoader.load('multimedia/images/particles/smoke.png', texture => {
      this.assets.partciles.smoke = texture
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
    this.gltfLoader.load('multimedia/models/cactus2.glb', (gltf) => {
      this.assets.models.cactus2 = gltf.scene
    })
  }
}