import checkWebpSupport from "../Utils/checkWebpSupport.js"
import isMobile from "../Utils/isMobile.js"
import parseOptions from "../Utils/parseOptions.js"

class Cache {
  constructor() {
    this.root = null
    this.aliases = {}
    this.elements = {}

    this._findRoot()
    if(!this.root)
      return console.error('no #root element');

    this._findAliases()

    this.support = {
      webp: checkWebpSupport(),
      isMobileDevice: isMobile()
    }
  }

  findElement(selector) {
    const element = this.elements[selector] || document.querySelector(selector)
    if(element) this.elements[selector] = element

    return element
  }

  findElements(selector) {
    selector = selector.toLowerCase()
    const elements = this.elements[selector] || [...this.root.querySelectorAll(selector)]
    if(elements.length) this.elements[selector] = elements
    return elements
  }

  findAlias(alias) {
    return this.aliases[alias]
  }

  _findRoot() {
    this.root = document.querySelector('#root')
  }

  _findAliases() {
    const rootAliases = parseOptions(this.root.getAttribute('data-aliases'), {}, this.root, this)
    this.aliases = {...this.aliases, ...rootAliases}

    this.root.querySelectorAll('[data-aliases]').forEach(el => {
      const elementAliases = parseOptions(el.getAttribute('data-aliases'), {}, el, this)
      this.aliases = {...this.aliases, ...elementAliases}
    })
  }
}

const cache = new Cache()

export default cache