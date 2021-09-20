import checkEmptiness from '../Utils/checkEmptiness.js'

export function findNode(parent, attribute, counterName, Constructor, storage) {
  const element = parent.querySelector(`[${attribute}="${counterName}"]`) || parent.querySelector(`[${attribute}]`)
  return Constructor && element ? new Constructor(element, storage) : element
}

export function findNodes(parent, attribute, counterName, Constructor, storage) {
  const elements = [...parent.querySelectorAll(`[${attribute}="${counterName}"]`)] || [...parent.querySelectorAll(`[${attribute}]`)]
  return Constructor ? elements.map((element, i) => new Constructor(element, storage, i)).filter(instance => !checkEmptiness(instance)) : elements
}