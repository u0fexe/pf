import Loop from "../Tools/Loop.js"
import Events from "../Tools/Events.js"
import clamp from "../Utils/clamp.js"
import lerp from "../Utils/lerp.js"

import model from './Model.js'
import force from './Force.js'
import Part from "./Part.js"

export default class Stop extends Part {
  constructor(id,node) {
    super(id, node, node.getAttribute('data-scroll-stop'), {
      progress: false,
      progressVars: true,
      progressOffset: 0,
      ease: 0
    })

    this.passed = 0
    this.inView = false
    this.events = new Events(
      'in',
      'out',
      'progress'
    )

    this.box.section.stops.push(this)
    this.prepareProgress()
  }

  prepareProgress() {
    this.possibleMedias.forEach(media => {
      if(!media.progress) return;

      if(typeof media.progress === 'boolean') {
        media.progress = [{
          from: 0,
          to: 1,
          varName: '--stop-progress',
          value: {
            currentN: 0,
            interpolatedN: 0,
          },
        }]
      }

      else if(!isNaN(media.progress)) {
        const n = media.progress
        const step = 1 / media.progress
        media.progress = [{
          from: 0,
          to: 1,
          varName: '--stop-progress-0',
          value: {
            currentN: 0,
            interpolatedN: 0,
          },
        }]
        for(let i = 0; i < n; i++) {
          media.progress.push({
            from: step * i,
            to: step * (i + 1),
            varName: '--stop-progress-' + (i + 1),
            value: {
              currentN: 0,
              interpolatedN: 0,
            },
          })
        }
      }

      else if(Array.isArray(media.progress)) {
        media.progress = media.progress.map((obj, i) => {
          return {
            from: 0,
            to: 1,
            varName: '--stop-progress-' + (i + 1),
            value: {
              currentN: 0,
              interpolatedN: 0,
            },
            ...obj,
          }
        })

        media.progress.from = +media.progress.from
        media.progress.to = +media.progress.to
      }
    })
  }

  resize(previousValue) {
    super.resize(previousValue)

    this.currentMedia.progress && this.currentMedia.progress.forEach((progress) => {
      progress.offset = model.screenSize * this.currentMedia.progressOffset
      progress.start = this.orientationBox.start + progress.offset
      progress.length = this.orientationBox.length - progress.offset * 2
      progress.fromCalculated = progress.from * progress.length + progress.start
      progress.toCalculated = progress.to * progress.length + progress.start
      progress.delta = progress.toCalculated - progress.fromCalculated
    })
  }

  $applyNewMedia() {
    super.$applyNewMedia()

    if(this.previousMedia.disabled) {
      model.updateScrollLength()
    }

    setTimeout(() => {
      if(this.currentMedia.progress) {
        this.progress()
      }
    }, 0)
  }

  $disable() {
    super.$disable()

    if(!this.used || this.previousMedia.disabled) return;

    this.passed = 0
    this.inView = false
    Loop.remove('stop' + this.id)
    model.updateScrollLength()

    if(this.previousMedia.progress && this.previousMedia.progressVars) {
      this.previousMedia.progress.forEach((progress) => {
        this.previousMedia.target.style.removeProperty(progress.varName)
      })
    }
  }

  in() {
    if(this.inView) return;
    this.inView = true

    this.passed = 0

    if(this.currentMedia.progress) {
      Loop.add('stop' + this.id, 'progress', this)
    }

    this.events.notify('in')
  }

  out(fastCheck) {
    if(!fastCheck && !this.inView) return;
    this.inView = false

    if (force.scrollValue.current > this.orientationBox.end) {
      this.passed = this.orientationBox.length
    }

    else if(force.scrollValue.current < this.orientationBox.start) {
      this.passed = 0
    }

    if(this.currentMedia.progress) {
      Loop.add('stop' + this.id, 'progress', this)
      Loop.removeAfterDelay('stop' + this.id)
    }

    this.events.notify('out')
  }

  check(fastCheck) {
    if(this.currentMedia.disabled) return;

    if(force.scrollValue.current >= this.orientationBox.start && force.scrollValue.current <= this.orientationBox.end) {
      this.in()
      return this
    } else {
      this.out(fastCheck)
    }
  }

  setProgress(v) {
    this.currentMedia.progress.forEach((progress) => {
      progress.value.currentN = progress.value.interpolatedN = v

      if(this.currentMedia.progressVars) {
        this.currentMedia.target.style.setProperty(progress.varName, progress.value.interpolatedN)
      }
    })

    this.events.notify('progress', this.currentMedia.progress)
  }

  progress() {
    this.currentMedia.progress.forEach((progress) => {

      progress.value.currentN = clamp(force.scrollValue.current - progress.fromCalculated, progress.delta) / progress.delta
      progress.value.interpolatedN = +lerp(progress.value.interpolatedN, progress.value.currentN, progress.ease || this.currentMedia.ease || force.instance.currentMedia.ease).toFixed(5)

      if(this.currentMedia.progressVars) {
        this.currentMedia.target.style.setProperty(progress.varName, progress.value.interpolatedN)
      }
    })
    this.events.notify('progress', this.currentMedia.progress, this.currentMedia.CSSVars)
  }
}