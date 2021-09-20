import CommonInput from './CommonInput.js'
import EmailInput from './EmailInput.js'
import PhoneInput from './PhoneInput.js'
import FileInput from './FileInput.js'
import CheckboxInput from './CheckboxInput.js'
import RadioInput from './RadioInput.js'

export default class Form {
  constructor(node, submitHandler) {
    this.node = node
    if(!this.node)
      return console.error('форма не найдена')

    this.check = this.check.bind(this)

    this.name = this.node.getAttribute('data-form')
    this.valid = false

    this.submitHandler = submitHandler

    this.findParts()
    this.listen()
    this.check()
  }

  findParts() {
    this.commonInputs = [...this.node.querySelectorAll('[data-common-input]')].map(node => new CommonInput(node, this.check))
    this.emailInputs = [...this.node.querySelectorAll('[data-email-input]')].map(node => new EmailInput(node, this.check))
    this.phoneInputs = [...this.node.querySelectorAll('[data-phone-input]')].map(node => new PhoneInput(node, this.check))
    this.fileInputs = [...this.node.querySelectorAll('[data-file-input]')].map(node => new FileInput(node, this.check))
    this.checkboxInputs = [...this.node.querySelectorAll('[data-checkbox-input]')].map(node => new CheckboxInput(node, this.check))
    this.radioInputs = [...this.node.querySelectorAll('[data-radio-input]')].map(node => new RadioInput(node, this.check))
  }

  listen() {
    this.node.addEventListener('submit', this.submit.bind(this))
  }

  markAsValid() {
    this.node.classList.remove('invalid')
    this.node.classList.add('valid')
  }

  markAsInvalid() {
    this.node.classList.remove('valid')
    this.node.classList.add('invalid')
  }

  check() {
    this.valid = true

    this.commonInputs.forEach(input => !input.valid && ( this.valid = false))
    this.emailInputs.forEach(input => !input.valid && ( this.valid = false))
    this.phoneInputs.forEach(input => !input.valid && ( this.valid = false))
    this.fileInputs.forEach(input => !input.valid && ( this.valid = false))
    this.checkboxInputs.forEach(input => !input.valid && ( this.valid = false))


    let radioInvalidCounter = 0
    this.radioInputs.forEach(input => !input.valid && radioInvalidCounter++)
    if(this.radioInputs.length && radioInvalidCounter === this.radioInputs.length) this.valid = false

    if(!this.valid) this.markAsInvalid()
    else this.markAsValid()
  }

  createFormData() {
    const formData = new FormData()

    if(this.name) formData.append('form-name', this.name)

    this.commonInputs.forEach(input => input.value && formData.append(input.options.name, input.value))
    this.emailInputs.forEach(input => input.value && formData.append(input.options.name, input.value))
    this.phoneInputs.forEach(input => input.value && formData.append(input.options.name, input.value))
    this.fileInputs.forEach(input => input.value && formData.append(input.options.name, input.value))
    this.checkboxInputs.forEach(input => input.value && formData.append(input.options.name, input.value))
    this.radioInputs.forEach(input => input.node.checked && input.value && formData.append(input.options.name, input.value))

    return formData
  }

  submit(e) {
    e.preventDefault()
    this.check()

    if(!this.valid) return;

    const formData = this.createFormData()

    this.submitHandler && this.submitHandler(formData)

    for (const pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }

    if(this.name) {
      document.documentElement.classList.add(`form-${this.name}-submitted`)
    } else {
      this.node.classList.add('submitted')
    }
  }
}