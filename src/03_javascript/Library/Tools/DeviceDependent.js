import cache from './Cache.js'
import parseOptions from '../Utils/parseOptions.js'
import splitTrimFilter from '../Utils/splitTrimFilter.js'

export default class DeviceDependent {
  constructor(node, defaultOptions) {
    if(!node) return;

    this.node = node
    this.defaultMedia = {check: '(min-width: 0px)', target: node, ...defaultOptions}
    this.currentMedia = {}
    this.previousMedia = {}
    this.possibleMedias = []

    this.parse()
  }

  parse() {
    this.possibleMedias.push({ ...this.defaultMedia })

    splitTrimFilter(this.node.getAttribute('data-medias') || '', '}').forEach(mediaString => {
      let media = {}
      const mediaParts = mediaString.split('{').map(part => part.trim())
      media.check = `(${mediaParts[0] ? cache.findAlias(mediaParts[0]) ? cache.findAlias(mediaParts[0]) : mediaParts[0] : 'min-width: 0px'})`

      if(mediaParts[1]) {
        const options = parseOptions(mediaParts[1], {}, this.node)
        media = {...this.defaultMedia, ...media, ...options}
      }

      this.possibleMedias.push(media)
    })

    this.node.removeAttribute('data-medias')
  }

  resize() {
    let lastMatchedMedia = {}

    for(const member in this.possibleMedias) {
      const media = this.possibleMedias[member]
      if(matchMedia(media.check).matches) {
        lastMatchedMedia = media
      }
    }

    this.previousMedia = this.currentMedia || this.defaultMedia

    if(!this.currentMedia || !this.currentMedia.check || lastMatchedMedia.check !== this.currentMedia.check) {
      this.currentMedia = { ...this.defaultMedia, ...lastMatchedMedia }
      if(this.currentMedia.disabled) {
        this.$disable && this.$disable()
      } else {
        this.$applyNewMedia && this.$applyNewMedia()
      }
    }
  }
}