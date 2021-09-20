import find from "../Utils/find.js"
import Path from "./Path.js"
import Section from "./Section.js"
import Stop from "./Stop.js"
import Box from "./Box.js"
import AttributeTrigger from "./Triggers/AttributeTrigger.js"
import ClassTrigger from "./Triggers/ClassTrigger.js"
import StyleTrigger from "./Triggers/StyleTrigger.js"
import ImageTrigger from "./Triggers/ImageTrigger.js"
import TextTrigger from "./Triggers/TextTrigger.js"

class Model {
  constructor() {
    this.instance = null
    this.sections = []
    this.stops = []
    this.paths = []
    this.imageTriggers = []
    this.classTriggers = []
    this.styleTriggers = []
    this.attributeTriggers = []
    this.textTriggers = []
    this.prevents = []
    this.boxes = []

    this.scrollLength = 0
    this.scrollLengthWithStops = 0
    this.stopsLength = 0
    this.screenSize = 0
    this.activeStop = null
    this.passedStopsLength = 0
    this.currentSection = null
  }

  findParts() {
    this.sections = find('[data-scroll-section]', Section)
    if(!this.sections.length) {
      console.error('page must have at least one scroll-section')
    }

    this.boxes = find('[data-scroll-box]', Box)
    this.stops = find('[data-scroll-stop]', Stop)
    this.paths = find('[data-scroll-path]', Path)
    this.attributeTriggers = find('[data-scroll-attribute-trigger]', AttributeTrigger)
    this.imageTriggers = find('[data-scroll-image-trigger]', ImageTrigger)
    this.classTriggers = find('[data-scroll-class-trigger]', ClassTrigger)
    this.styleTriggers = find('[data-scroll-style-trigger]', StyleTrigger)
    this.textTriggers = find('[data-scroll-text-trigger]', TextTrigger)
    this.prevents = [...this.prevents, ...document.querySelectorAll('[data-scroll-prevent]')]
  }

  resizeSections() {
    this.sections.forEach(section => section.resize())
  }

  fixateSections() {
    this.sections.forEach(section => section.fixate())
  }

  unfixSections() {
    this.sections.forEach(section => section.unfix())
  }

  switchSectionsTranslateFunction() {
    this.sections.forEach(section => section.switchTranslateFunction())
  }

  translateSections() {
    if(!this.instance.currentMedia.staticSections) {
      this.sections.forEach(section => section.translateFunction())
    }
  }

  checkSections() {
    this.sections.forEach(section => section.check())
    const sectionsInView = this.sections.filter(section => !!section.inView)
    this.currentSection = sectionsInView[sectionsInView.length - 1]
    if(this.currentSection && this.currentSection.name) {
      document.documentElement.setAttribute('data-current-section', this.currentSection.name)
    }
  }

  resizeStops() {
    this.stopsLength = 0
    this.stops.forEach(stop => {
      stop.resize(this.stopsLength)
      this.stopsLength += stop.orientationBox.length
    })

  }

  checkStops(fastCheck) {
    this.activeStop = this.stops.find(stop => stop.check(fastCheck))
    this.passedStopsLength = this.stops.reduce((acc, curr) => acc += curr.passed, 0)
  }

  resizePaths() {
    this.paths.forEach(path => path.resize())
  }

  checkPaths(fastCheck) {
    this.paths.forEach(path => path.check(fastCheck))
  }

  resizeTriggers() {
    this.imageTriggers.forEach(trigger => trigger.resize())
    this.classTriggers.forEach(trigger => trigger.resize())
    this.styleTriggers.forEach(trigger => trigger.resize())
    this.attributeTriggers.forEach(trigger => trigger.resize())
    this.textTriggers.forEach(trigger => trigger.resize())
  }

  checkTriggers() {
    this.imageTriggers.forEach(trigger => trigger.check())
    this.classTriggers.forEach(trigger => trigger.check())
    this.styleTriggers.forEach(trigger => trigger.check())
    this.attributeTriggers.forEach(trigger => trigger.check())
    this.textTriggers.forEach(trigger => trigger.check())
  }

  checkPrevents(target) {
    return this.prevents.find(pr => pr.contains(target))
  }

  resizeBoxes() {
    this.boxes.forEach(box => box.resize())
  }

  findBox(name) {
    return this.boxes.find(box => box.name === name)
  }

  findBoxes(name) {
    return this.boxes.filter(box => box.name === name)
  }

  createBox(node, name, part) {
    const match = this.boxes.find(box => box.node === node)
    if(match) {
      return match
    } else {
      const box = new Box(this.boxes.length, node, name, part)
      this.boxes.push(box)
      return box
    }
  }

  addListener(parts, partName, event, callback) {
    const part = this[parts].find(part => part.name === partName)
    if(!part) return console.error(`${parts.slice(0, -1)} with name "${partName}" not found`)
    part.events.addListener(event, callback)
  }

  removeListener(parts, partName, event, callback) {
    const part = this[parts].find(part => part.name === partName)
    if(!part) return console.error(`${parts.slice(0, -1)} with name "${partName}" not found`)
    part.events.removeListener(event, callback)
  }

  addStopListener(stopName, event, callback) {
    this.addListener('stops', stopName, event, callback)
  }

  removeStopListener(stopName, event, callback) {
    this.removeListener('stops', stopName, event, callback)
  }

  addImageTriggerListener(triggerName, event, callback) {
    this.addListener('imageTriggers', triggerName, event, callback)
  }

  removeImageTriggerListener(triggerName, event, callback) {
    this.removeListener('imageTriggers', triggerName, event, callback)
  }

  addClassTriggerListener(triggerName, event, callback) {
    this.addListener('classTriggers', triggerName, event, callback)
  }

  removeClassTriggerListener(triggerName, event, callback) {
    this.removeListener('classTriggers', triggerName, event, callback)
  }

  addStyleTriggerListener(triggerName, event, callback) {
    this.addListener('styleTriggers', triggerName, event, callback)
  }

  removeStyleTriggerListener(triggerName, event, callback) {
    this.removeListener('styleTriggers', triggerName, event, callback)
  }

  addAttributeTriggerListener(triggerName, event, callback) {
    this.addListener('attributeTriggers', triggerName, event, callback)
  }

  removeAttributeTriggerListener(triggerName, event, callback) {
    this.removeListener('attributeTriggers', triggerName, event, callback)
  }

  addTextTriggerListener(triggerName, event, callback) {
    this.addListener('textTriggers', triggerName, event, callback)
  }

  removeTextTriggerListener(triggerName, event, callback) {
    this.removeListener('textTriggers', triggerName, event, callback)
  }

  addPathListener(pathName, event, callback) {
    this.addListener('paths', pathName, event, callback)
  }

  removePathListener(pathName, event, callback) {
    this.removeListener('paths', pathName, event, callback)
  }

  addSectionListener(sectionName, event, callback) {
    this.addListener('sections', sectionName, event, callback)
  }

  removeSectionListener(sectionName, event, callback) {
    this.removeListener('sections', sectionName, event, callback)
  }

  updateScreenSize() {
    this.screenSize = this.instance.currentMedia.type === 'vertical' ? innerHeight : innerWidth
  }

  updateScrollLength() {
    this.scrollLength = model.sections.reduce((acc, curr) => {
      const size = this.instance.currentMedia.type === 'vertical' ? curr.heightWithMargins : curr.widthWithMargins
      return acc + size
    }, 0) - (this.instance.currentMedia.smooth ? this.screenSize : 0)

    this.scrollLengthWithStops = this.scrollLength + this.stopsLength
  }
}

const model = new Model()
export default model