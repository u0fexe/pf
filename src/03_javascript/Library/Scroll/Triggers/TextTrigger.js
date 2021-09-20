import splitTrimFilter from '../../Utils/splitTrimFilter.js'
import cssEasings from '../../Utils/cssEasings.js'
import ToggleTrigger from './ToggleTrigger.js'

// переделать ??
export default class TextTrigger extends ToggleTrigger {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-text-trigger'), {
      extraLength: 1,
      offset: -1,
      letters: false,
      words: false,

      fromX: '0px',
      fromY: '0px',
      fromRx: false,
      fromRy: false,
      fromRz: false,
      fromS: false,

      toX: '0px',
      toY: '0px',
      toRx: false,
      toRy: false,
      toRz: false,
      toS: false,

      fromOpacity: false,
      toOpacity: false,

      toMatrix: '0px',
      fromDuration: '1s',
      toDuration: '1s',
      ease: cssEasings['easeInOutExpo'],
      toDelayBefore: 0,
      fromDelayBefore: 0,
      fromDelay: '0s',
      toDelay: '0s',
    })
  }

  createWrapper(text = '', overflow = true) {
    const wrapper = document.createElement('span')
    wrapper.innerText = text
    wrapper.style.display = 'inline-block'
    if(overflow) {
      wrapper.style.overflow = 'hidden'
      wrapper.style.position = 'relative'
    }

    return wrapper
  }

  lerp(id, length, final) {
    let res = final + ''

    if(res.startsWith('-')) {
      final = parseInt(Math.abs(final))
      res = final - id / length * final
    }

    else if(res.startsWith('-+') || res.startsWith('+-')) {
      final = parseInt(final.slice(2))
      res = Math.abs((id / length - 0.5)) * 2 * final
    }

    else if(!isNaN(res)) {
      res = id / length * final
    } else {
      res = res.slice(0, -1)
    }

    return parseFloat(res)
  }

  getTransform(type) {
    let transform = ''

    if(type === 'from') {
      if(this.currentMedia.fromX) {
        transform += `translateX(${this.currentMedia.fromX})`
      }

      if(this.currentMedia.fromY) {
        transform += ` translateY(${this.currentMedia.fromY})`
      }

      if(this.currentMedia.fromRz) {
        transform += ` rotateZ(${this.currentMedia.fromRz})`
      }

      if(this.currentMedia.fromRX) {
        transform += ` rotateX(${this.currentMedia.fromRx})`
      }

      if(this.currentMedia.fromRy) {
        transform += ` rotateY(${this.currentMedia.fromRy})`
      }

      if(!isNaN(this.currentMedia.fromS) && typeof this.currentMedia.fromS !== 'boolean') {
        transform += ` scale(${this.currentMedia.fromS})`
      }

    } else {
      if(this.currentMedia.toX) {
        transform += `translateX(${this.currentMedia.toX})`
      }

      if(this.currentMedia.toY) {
        transform += ` translateY(${this.currentMedia.toY})`
      }

      if(this.currentMedia.toRz) {
        transform += ` rotateZ(${this.currentMedia.toRz})`
      }

      if(this.currentMedia.toRX) {
        transform += ` rotateX(${this.currentMedia.toRx})`
      }

      if(this.currentMedia.toRy) {
        transform += ` rotateY(${this.currentMedia.toRy})`
      }

      if(!isNaN(this.currentMedia.toS) && typeof this.currentMedia.toS !== 'boolean') {
        transform += ` scale(${this.currentMedia.toS})`
      }
    }
    return transform
  }

  createBox(text, id, length) {
    const box = document.createElement('span')
    box.innerHTML = text
    box.userData = {}
    box.style.display = 'inline-block'

    const sameDuration = this.currentMedia.toDuration === this.currentMedia.fromDuration
    const sameDelay = this.currentMedia.toDuration === this.currentMedia.fromDuration

    box.userData.toDuration = this.lerp(id, length, this.currentMedia.toDuration)
    box.userData.toDelay = this.lerp(id, length, this.currentMedia.toDelay) + this.currentMedia.toDelayBefore
    box.userData.fromDuration = sameDuration ? box.userData.toDuration : this.lerp(id, length, this.currentMedia.fromDuration)
    box.userData.fromDelay = sameDelay ? box.userData.toDelay : this.lerp(id, length, this.currentMedia.fromDelay) + this.currentMedia.fromDelayBefore

    box.userData.transitionFrom = `transform ${box.userData.fromDuration}s ${box.userData.fromDelay}s ${this.currentMedia.ease}`
    box.userData.transformFrom = box.style.transform = this.getTransform('from')
    box.userData.transitionTo = `transform ${box.userData.toDuration}s ${box.userData.toDelay }s ${this.currentMedia.ease}`
    box.userData.transformTo = this.getTransform('to')

    if(this.opacityOn) {
      box.userData.transitionFrom += `, opacity ${box.userData.fromDuration}s ${box.userData.fromDelay}s ${this.currentMedia.ease}`
      box.userData.transitionTo += `, opacity ${box.userData.toDuration}s ${box.userData.toDelay}s ${this.currentMedia.ease}`
      box.userData.fromOpacity = box.style.opacity = this.currentMedia.fromOpacity
      box.userData.toOpacity = this.currentMedia.toOpacity
    }

    return box
  }

  createLetters(words) {
    const letters = words.map(word => word.innerText.trim().split('').map(l => !l.trim() && '&nbsp;' || l))
    const textLength = letters.flat().length
    let passedLength = 0

    this.letters = words.map((word, i) => {
      word.innerHTML = ''

      passedLength += (letters[i - 1] && letters[i - 1].length || 0)
      const boxes = letters[i].map((letter, j) => this.createBox(letter, j + passedLength, textLength))

      word.append(...boxes)
      return boxes
    })

    this.letters = this.letters.flat()
  }

  prepareText() {
    this.text = this.node.innerText.trim()
    this.html = this.node.innerHTML
    if(!this.text) return;
    this.node.innerHTML = ''

    this.textWrapper = this.createWrapper()
    this.textWrapper.classList.add('text-wrapper')

    if(this.currentMedia.words && !this.currentMedia.letters) {
      this.words = splitTrimFilter(this.text, ' ').map((word, i, currentArray) => this.createBox(word, i, currentArray.length - 1))
    }

    else if(this.currentMedia.words && this.currentMedia.letters) {
      this.words = splitTrimFilter(this.text, ' ').map(word => this.createWrapper(word, false))
      this.createLetters(this.words)
    }

    else if(!this.currentMedia.words && this.currentMedia.letters) {
      this.words = [this.createWrapper(this.text, false)]
      this.createLetters(this.words)
    }

    else {
      this.words = [this.createBox(this.text, 0, 1)]
    }

    this.textWrapper.append(...this.words)
    this.node.appendChild(this.textWrapper)


    this.words.forEach((w, i) => {
      if(i !== 0) {
        const space = document.createElement('span')
        space.innerHTML = '&nbsp;'
        w.parentNode.insertBefore(space, w)
      }

      w.classList.add('word')
    })

    this.letters && this.letters.forEach((l, i) => {
      l.classList.add('letter')
    })
  }

  $applyNewMedia() {
    super.$applyNewMedia()
    this.opacityOn = !isNaN(this.currentMedia.fromOpacity) && !isNaN(this.currentMedia.toOpacity)
    this.prepareText()
  }

  $disable() {
    super.$disable()

    if(this.text) {
      this.node.innerHTML = this.html
    }
  }

  transformTo(boxes, noTransition) {
    boxes.forEach(box => {
      box.style.transition = noTransition ? '' : box.userData.transitionTo
      box.style.transform = box.userData.transformTo
      if(this.opacityOn) {
        box.style.opacity = box.userData.toOpacity
      }
    })
  }

  transformFrom(boxes, noTransition) {
    boxes.forEach(box => {
      box.style.transition = noTransition ? '' : box.userData.transitionFrom
      box.style.transform = box.userData.transformFrom
      if(this.opacityOn) {
        box.style.opacity = box.userData.fromOpacity
      }
    })
  }

  in() {
    super.in()

    this.transformTo(this.letters || this.words)
  }

  outChecked() {
    this.transformFrom(this.letters || this.words)
  }

  afterEnd() {
    if(!this.currentMedia.keep) {
      this.transformTo(this.letters || this.words, true)
    }
  }

  beforeStart() {
    this.transformFrom(this.letters || this.words, true)
  }
}
