import Events from './Events.js'

let id = 0
export default class Accordion {
  constructor(node) {
    this.id = ++id

    this.events = new Events('open', 'close')

    this.neigbours = []

    this.group = node.getAttribute('data-accordion') || 'default'
    this.findElements(node)

    if(this.rows.length) {
      this.activeRow = null
      this.listen()
    }
  }


  findElements(node) {
    this.accordion = node
    this.rows = [...this.accordion.querySelectorAll('[data-accordion-row]')].map(row => {
      const head = row.querySelector('[data-accordion-head]')
      const body = row.querySelector('[data-accordion-body]')
      const isActive = row.hasAttribute('data-active')
      return { head, body, node: row, isActive }
    })
  }

  unactive() {
    if(this.activeRow) {
      this.activeRow.node.classList.remove('active')
      document.documentElement.style.setProperty(`--accordion-${this.id}-occupied`, 0 + 'px')
    }
  }

  active(row) {
    row.node.classList.add('active')
    document.documentElement.style.setProperty(`--accordion-${this.id}-occupied`, row.body.offsetHeight + 'px')
  }

  close() {
    this.rows.forEach(row => row.node.style.transform = `translateY(0px)`);
    this.activeRow = null
    this.events.notify('close')
  }

  open(activeRow, currentI) {
    this.rows.forEach((row, checkedI) => {
      if(checkedI > currentI) {
        row.node.style.transform = `translateY(${activeRow.body.offsetHeight}px)`
      } else {
        row.node.style.transform = `translateY(0px)`
      }
    })

    this.activeRow = activeRow
    this.events.notify('open')

    this.neigbours.forEach(n => {
      n.unactive()
      n.close()
    })
  }

  listen() {
    this.rows.forEach((row, currentI) => {
      const cb = () => {
        if(this.activeRow) {
          this.unactive()

          if(this.activeRow === row) {
            this.close()
            return;
          }
        }

        this.active(row)
        this.open(row, currentI)
      }

      row.head.addEventListener('click', cb)
      if(row.isActive) {
        addEventListener('load', () => cb())
      }
    })
  }
}

export function findAllAccordions() {
  const accordions = [...document.querySelectorAll('[data-accordion]')].map(accordion => new Accordion(accordion))

  accordions.forEach(acc1 => {
    accordions.forEach(acc2 => {
      if(acc1 === acc2 || acc1.group !== acc2.group) return;
      acc1.neigbours.push(acc2)
    })
  })

  return accordions
}