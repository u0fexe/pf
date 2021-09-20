import Cache from '../Tools/Cache.js'

export default function(selector, Class, options) {
  return [...Cache.findElements(selector)].map((el, id) => new Class(id, el, options))
}