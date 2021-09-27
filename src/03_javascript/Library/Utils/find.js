import Cache from '../Tools/Cache.js'

export default function(selector, Class, options) {
  const elements = [...Cache.findElements(selector)]
  const filtered = elements.filter(el => !(el.hasAttribute('data-only-desktop') && Cache.support.isMobileDevice))
  return filtered.map((el, id) => new Class(id, el, options))
}