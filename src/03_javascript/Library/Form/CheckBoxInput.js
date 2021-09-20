import Input from './Input.js'

export default class CheckboxInput extends Input {
  constructor(node, formCheck) {
    super(
      node,
      formCheck,
      {
        name: 'checkbox',
      }
    )
  }

  check() {
    if(this.options.required) {

      if(this.node.checked) {
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
}