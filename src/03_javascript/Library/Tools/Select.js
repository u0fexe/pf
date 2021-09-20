import IndependentWindow from './IndependentWindow.js'

export default class Select extends IndependentWindow {
  constructor(node, settings) {
    super(node, settings)
    this.findParts()
    this.listen()
  }

  findParts() {
    this.options = this.node.querySelectorAll("[data-select-option]")
    this.choices = this.node.querySelectorAll("[data-select-choice]")
    this.heads = this.node.querySelectorAll("[data-select-head]")
  }

  listen() {
    this.heads.forEach(head => head.addEventListener('click', this.open))

    this.options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.hasAttribute('data-value') && option.getAttribute('data-value') || option.innerText
        this.choices.forEach(choice => {
          if(choice.tagName === 'INPUT' || choice.tagName === 'TEXTAREA') {
            choice.setAttribute('value', value)
          } else {
            choice.innerText = value
          }
        })
        this.close()
      })
    })
  }
}

export function findAllSelects() {
  return [...document.querySelectorAll('[data-select]')].map(node => new Select(node, {esc: true, out: true}))
}