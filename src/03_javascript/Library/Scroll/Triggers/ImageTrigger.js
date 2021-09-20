import cache from '../../Tools/Cache.js'
import splitTrimFilter from '../../Utils/splitTrimFilter.js'
import model from '../Model.js'
import Trigger from './Trigger.js'

export default class ImageTrigger extends Trigger {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-image-trigger'), {
      extraLength: 1,
      offset: -2,
      image: false,
      x: false,
      webp: false
    })

    this.imageLoaded = false
    this.events.addEvents('loadImage')

    this.prepareImages()
  }

  $applyNewMedia() {
    super.$applyNewMedia()
    this.imageLoaded = false
  }

  $disable() {
    super.$disable()

    this.imageLoaded = false

    if(this.previousMedia.image) {
      this.previousMedia.target.style.backgroundImage = ''
      this.previousMedia.target.src = ''
    }
  }

  prepareImages() {
    this.possibleMedias.forEach(media => {
      if(!media.image || (!media.x && !media.webp)) return;

      const extensionIndex = media.image.lastIndexOf('.')
      const extension = media.image.slice(extensionIndex + 1)
      let imageName = media.image.slice(0, extensionIndex)

      if(media.x) {
        const ratios = splitTrimFilter(media.x, '/')
        const matchRatio = ratios.find(r => r == devicePixelRatio)

        if(matchRatio) {
          imageName += '@' + matchRatio + 'x'
        } else {
          imageName += '@' + ratios[ratios.length - 1] + 'x'
        }
      }

      if(media.webp && cache.support.webp) {
        media.image = `${imageName}.webp`
      } else {
        media.image = `${imageName}.${extension}`
      }
    })
  }

  loadImage() {
    if(this.currentMedia.target.tagName === 'IMG') {
      this.currentMedia.target.src = this.currentMedia.image
    } else {
      this.currentMedia.target.style.backgroundImage = `url(${this.currentMedia.image})`
    }

    this.imageLoaded = true
    this.events.notify('loadImage', { target: this.currentMedia.target, image: this.currentMedia.image })

    model.imageTriggers.forEach(imageTrigger => {
      if(imageTrigger === this) return;

      if(imageTrigger.currentMedia.image === this.currentMedia.image) {
        imageTrigger.in()
      }
    })
  }

  in() {
    if(this.imageLoaded) return;

    super.in()

    if(this.currentMedia.image) {
      this.loadImage()
    }
  }

  out() {
    super.out()
  }
}
