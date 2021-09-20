import Input from './Input'

export default class FileInput extends Input {
  constructor(node, formCheck) {
    super(
      node,
      formCheck,
      {
        name: 'file',
        max: Infinity,
        reg: '.*'
      }
    )
  }

  check() {

    const checkFile = (file) => {
      if(!file) return this.markAsInvalid();

      const fr = new FileReader()
      fr.readAsDataURL(file)

      fr.onload = () => {
        const name = file.name
        const lastDot = name.lastIndexOf('.')

        const fileName = name.substring(0, lastDot)
        const fileExt = name.substring(lastDot + 1)
        const fileSize = file.size / 1024 / 1024

        if(this.reg.test(fileExt)) {
          if (fileSize > this.options.max) {
            this.markAsInvalid()
          } else {
            this.markAsValid()
            this.value = file
          }
        }
      }

      this.loaded = true
    }

    const file = this.node.files[0]

    if(file && this.options.required || file && !this.options.required || !file && this.options.required) {
      checkFile(file)
    } else {
      this.markAsValid()
    }
  }
}