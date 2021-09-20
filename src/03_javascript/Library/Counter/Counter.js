import debounce from '../Utils/debounce.js'
import bind from '../Utils/bind.js'
import pad from '../Utils/pad.js'

import { findNode, findNodes } from './utils.js'

import DeviceDependent from '../Tools/DeviceDependent.js'
import Events from '../Tools/Events.js'

import Viewport from './Viewport.js'
import Content from './Content.js'
import Item from './Item.js'
import Items from './Items.js'
import Storage from './Storage.js'
import StepButton from './StepButton.js'
import Button from './Button.js'

export default class Counter extends DeviceDependent {
  constructor(node) {
    super(node, {
      step: 1,
      activeItems: 1,
      throttle: 0,
      splitScreen: 1,
      dragEase: 0.1,
      lengthOffset: 0,
      endOffset: 0,
      dragSpeedMultiplier: 1,

      loop: false,

      swipe: false,
      wheel: false,
      drag: false,
      numberButtons: false,
      stepButtons: false,
      itemButtons: false,

      counterVariable: true,
      lengthVariable: false,
      maxVariable: false,
      viewportSizeVariables: false,
      firstLastVariables: false,
      itemsArrayInfo: false,

      counterAttribute: false,
      lengthAttribute: false,
      firstLastAttributes: false,

      itemsPositions: false,
      convertDragToCounter: false,
      convertCounterToDrug: false,

      viewportWidthCrop: null,
    })

    if(!this.node) return;

    bind(['resize'], this)

    this.counterName = this.node.getAttribute('data-counter')
    this.counterLabel = this.node.getAttribute('data-counter-label')
    this.events = new Events('counterChange', 'ready')
    this.storage = new Storage(this.events)
    this.ready = false

    this.find()
    this.listen()
  }

  find() {
    this.storage.viewport = findNode(this.node, 'data-counter-viewport', this.counterName, Viewport, this.storage)
    this.storage.content = findNode(this.node, 'data-counter-content', this.counterName, Content, this.storage)

    this.findItems()

    this.storage.stepButtons = findNodes(this.node, 'data-counter-step-button', this.counterName, StepButton, this.storage)

    this.storage.numberButtons = findNodes(this.node, 'data-counter-number-buttons', this.counterName)
    if(this.storage.numberButtons.length) {
      this.storage.numberButtons = this.storage.numberButtons.map(container => [...container.children]).map(container => container.map((b, i) => new Button(b, this.storage, i))).flat()
    } else {
      this.storage.numberButtons = findNodes(this.node, 'data-counter-number-button', this.counterName, Button, this.storage)
    }

    if(this.counterLabel) {
      this.storage.disableButtons = document.querySelectorAll(`[data-counter-disable-button="${this.counterLabel}"]`)
      this.storage.reloadButtons = document.querySelectorAll(`[data-counter-reload-button="${this.counterLabel}"]`)
    }
  }

  findItems() {
    if(this.storage.content) {
      this.storage.items = [...this.storage.content.node.children]
      this.storage.items = this.storage.items.length ? new Items([...this.storage.items].map((node, i) => new Item(node, this.storage, i)), this.storage) : null
    } else {
      this.storage.items = findNodes(document, 'data-counter-item', this.counterName, Item, this.storage)
      this.storage.items = this.storage.items.length ? new Items(this.storage.items, this.storage) : null
    }

    if(!this.storage.items) console.warn(`counter: id: ${this.storage.counterId}, name: ${this.name || 'unknown'} ---> NO ITEMS`)
  }

  resize() {
    super.resize()
    if(!this.storage.items) return;

    if(this.storage.viewport) this.storage.viewport.resize()
    this.updateDomAfterViewportResize()

    setTimeout(() => {
      if(this.storage.content) this.storage.content.resize()
    }, 0)
  }

  listen() {
    new ResizeObserver(debounce(this.resize)).observe(this.node)

    this.storage.disableButtons.forEach(b => {
      b.addEventListener('click', () => {
        this.$disable()
      })
    })

    this.storage.reloadButtons.forEach(b => {
      b.addEventListener('click', () => {
        this.$applyNewMedia()
      })
    })
  }

  $disable() {
    this.storage.previousMedia = this.previousMedia
    this.storage.currentMedia = this.currentMedia

    this.destroyOldFunctional()
    this.storage._counter = -1

    if(this.previousMedia.target) {
      this.clearDom()
    }
  }

  clearDom() {
    if(!this.previousMedia.target) return;

    this.previousMedia.target.style.removeProperty('--counter')

    if(this.previousMedia.counterAttribute) {
      this.previousMedia.target.removeAttribute('data-counter')
    }

    if(this.previousMedia.firstLastVariables) {
      this.previousMedia.target.style.removeProperty('--first')
      this.previousMedia.target.style.removeProperty('--last')
    }

    if(this.previousMedia.firstLastAttributes) {
      this.previousMedia.target.removeAttribute('data-first')
      this.previousMedia.target.removeAttribute('data-last')
    }

    if(this.previousMedia.lengthVariable) {
      this.previousMedia.target.style.removeProperty('--length')
    }

    if(this.previousMedia.maxVariable) {
      this.previousMedia.target.style.removeProperty('--max')
    }

    if(this.previousMedia.dragAvailable) {
      this.storage.currentMedia.target.style.removeProperty('--drag')
      this.storage.currentMedia.target.style.removeProperty('--drag-normalized')
    }

    if(this.storage.viewport && this.previousMedia.viewportSizeVariables) {
      this.previousMedia.target.style.removeProperty('--viewport-width')
      this.previousMedia.target.style.removeProperty('--viewport-height')
    }

    if(this.previousMedia.itemsPositions) {
      this.storage.items.clearDom()
    }

    if(this.previousMedia.itemsArrayInfo) {
      this.storage.items.clearArrayInfo()
    }

    if(this.previousMedia.lengthAttribute) {
      this.previousMedia.target.removeAttribute('data-length')
    }

    this.node.classList.remove('no-active-overflow')
    this.node.classList.remove('length-less-than-active')
  }

  updateDomAfterViewportResize() {
    if(this.storage.viewport && this.currentMedia.viewportSizeVariables) {
      this.currentMedia.target.style.setProperty('--viewport-width', this.storage.viewport.width + 'px')
      this.currentMedia.target.style.setProperty('--viewport-height', this.storage.viewport.height + 'px')
    }
  }

  $applyNewMedia() {
    this.storage.previousMedia = this.previousMedia
    this.storage.currentMedia = this.currentMedia

    if(this.storage.currentMedia.activeItems !== 1) {
      this.storage.currentMedia.step = 1
    }

    this.clearDom()
    this.destroyOldFunctional()
    this.createNewFunctional()
    this.storage.items.applyNewMedia()
    this.storage.stepButtons.forEach(b => b.applyNewMedia())
    this.storage.numberButtons.forEach(b => b.applyNewMedia())

    this.storage.counter = -10
    this.currentMedia.dragAvailable = this.currentMedia.drag && this.storage.viewport && this.storage.content

    if(this.currentMedia.dragAvailable) {
      this.storage.content.updateDomVariables(0, 0)
    }

    if(this.currentMedia.lengthVariable) {
      this.currentMedia.target.style.setProperty('--length', this.storage.items.length)
    }

    if(this.currentMedia.maxVariable) {
      this.currentMedia.target.style.setProperty('--max', this.storage.items.max)
    }

    if(this.currentMedia.lengthAttribute) {
      this.currentMedia.target.setAttribute('data-length', pad(this.storage.items.length, 2))
    }

    if(!this.ready) {
      this.events.notify('ready')
      this.ready = true
    }

    if(this.storage.items.length <= this.currentMedia.activeItems) {
      this.node.classList.add('no-active-overflow')
    }

    if(this.storage.items.length < this.currentMedia.activeItems) {
      this.node.classList.add('length-less-than-active')
    }

    if(this.currentMedia.itemsArrayInfo) {
      this.storage.items.showArrayInfo()
    }
    this.storage.counter = 0
  }

  destroyOldFunctional() {
    const unlisten = (eventName, cb) => this.previousMedia[eventName] && !this.currentMedia[eventName] && cb()

    if(this.storage.viewport) {
      unlisten('wheel', () => this.storage.viewport.unlistenWheel())
      unlisten('swipe', () => this.storage.viewport.unlistenSwipe())

      if(this.storage.content && !this.previousMedia.swipe) {
        unlisten('drag', () => this.storage.content.unlistenDrag())
      }
    }

    unlisten('stepButtons', () => this.storage.stepButtons.forEach(b => b.unlisten()))
    unlisten('numberButtons', () => this.storage.numberButtons.forEach(b => b.unlisten()))
    unlisten('itemButtons', () => this.storage.items.items.forEach(item => item.unlisten()))
  }

  createNewFunctional() {
    const listen = (eventName, cb) => !this.previousMedia[eventName] && this.currentMedia[eventName] && cb()

    if(this.storage.viewport) {
      listen('wheel', () => this.storage.viewport.listenWheel())
      listen('swipe', () => this.storage.viewport.listenSwipe())

      if(this.storage.content && !this.currentMedia.swipe) {
        listen('drag', () => this.storage.content.listenDrag())
      }
    }

    listen('stepButtons', () => this.storage.stepButtons.forEach(b => b.listen()))
    listen('numberButtons', () => this.storage.numberButtons.forEach(b => b.listen()))
    listen('itemButtons', () => this.storage.items.items.forEach(item => item.listen()))
  }
}