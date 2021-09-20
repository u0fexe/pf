import ToggleTrigger from './ToggleTrigger.js'

export default class PropertyTrigger extends ToggleTrigger {
  constructor(id, node, name, settings = {}) {
    super(id, node, name, {
      data: false,
      keep: false,
      ...settings
    })

    this.events.addEvents('addProperty', 'removeProperty')
  }


  in() {
    super.in()
    this.events.notify('addProperty', { target: this.currentMedia.target, data: this.currentMedia.data})
  }

  outChecked() {
    this.events.notify('removeProperty', { target: this.currentMedia.target, data: this.currentMedia.data})
  }
}
