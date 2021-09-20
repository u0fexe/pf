import Input from './Input.js'

export default class PhoneInput extends Input {
  constructor(node, formCheck) {
    super(
      node,
      formCheck,
      {
        name: 'phone',
        min: 0,
        max: 30,
        reg: '^[0-9-+() ]+$'
      }
    )
  }
}