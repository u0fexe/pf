import parseOptions from "../Utils/parseOptions.js"
import bind from "../Utils/bind.js"

export default class Input {
  constructor(node, formCheck, defaultOptions = {}) {
    this.options = parseOptions(node.getAttribute('data-options'),  { required: false, min: 0, max: Infinity, ...defaultOptions }, node)

    this.node = node

    this.value = this.node.value
    this.reg = null
    this.valid = true
    this.loaded = false

    this.formCheck = formCheck

    bind(['handleInput'], this)

    this.defineTarget()
    this.defineReg()
    this.listen()
    this.check()
  }

  defineTarget() {
    if(!this.options.target) {
      this.options.target = this.node
    }
  }

  defineReg() {
    if(this.options.reg) {
      this.reg = new RegExp(this.options.reg)
    } else {
      this.reg = null
    }
  }

  markAsValid(validClass = 'valid', invalidClass = 'invalid') {
    if(this.loaded) {
      this.options.target.classList.remove(invalidClass)
      this.options.target.classList.add(validClass)
    }

    this.valid = true
  }

  markAsInvalid(validClass = 'valid', invalidClass = 'invalid') {
    if(this.loaded) {
      this.options.target.classList.remove(validClass)
      this.options.target.classList.add(invalidClass)
    }

    this.valid = false
  }

  check() {
    const valueLength = this.value && this.value.length
    if(this.options.required || (!this.options.required && this.value && valueLength !== 0)) {


      if(this.options.reg && this.reg.test(this.value) && valueLength >= this.options.min && valueLength <= this.options.max) {
        this.markAsValid()
      } else {
        this.markAsInvalid()
      }
    }

    else {
      this.markAsValid()
    }

    this.loaded = true
  }

  listen() {
    this.node.addEventListener('input', this.handleInput)
    new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type == "attributes" && mutation.attributeName === 'value') {
          this.handleInput({ target: mutation.target })
        }
      })
    }).observe(this.node, { attributes: true })
  }

  handleInput(e) {
    this.value = e.target.value
    this.check()
    this.formCheck()
  }
}
