import IndependentWindow from "./IndependentWindow.js"
import parseOptions from '../Utils/parseOptions.js'

export default class Modal extends IndependentWindow {
  constructor(node, settings) {
    super(node, settings)

    this.name = node.getAttribute('data-modal')
    this.activeTumbler = null

    this.findParts()
    this.listen()
  }

  findParts() {
    this.tumblers = document.querySelectorAll(`[data-modal-tumbler="${ this.name }"]`)
  }

  listen() {
    this.tumblers.forEach(tumbler => {
      tumbler.addEventListener('click', () => {
        tumbler.classList.add('active')
        this.activeTumbler = tumbler
        if(this.name) document.documentElement.classList.add('modal-' + this.name)
        this.open()
      })
    })
  }

  close() {
    super.close()
    this.activeTumbler && this.activeTumbler.classList.remove('active')
    if(this.name) document.documentElement.classList.remove('modal-' + this.name)
  }
}

export function findAllModals() {
  return [...document.querySelectorAll('[data-modal]')].map(node => new Modal(node, node.hasAttribute('data-options') ? parseOptions(node.getAttribute('data-options')) : {}))
}