import force from "../Force.js"

export default class Default {
  listen() {
    force.instance.node.addEventListener('scroll', this.scroll)
  }

  unlisten() {
    force.instance.node.removeEventListener('scroll', this.scroll)
  }

  scroll() {
    force.set(force.instance.node.scrollTop )
  }
}