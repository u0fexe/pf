import Input from './Input'

export default class CommonInput extends Input {
  constructor(node, formCheck) {
    super(
      node,
      formCheck,
      {
        name: 'common',
        min: 1,
        max: 30,
        reg: '.*'
      }
    )
  }
}