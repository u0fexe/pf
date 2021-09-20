import Input from './Input'

export default class EmailInput extends Input {
  constructor(node, formCheck) {
    super(
      node,
      formCheck,
      {
        name: 'email',
        min: 0,
        max: 30,
        reg: '\\S+@\\S+\\.\\S+',
      }
    )
  }
}