import splitTrimFilter from './splitTrimFilter.js'

export default function on(element, events, callback, options = {}) {
  const remove = splitTrimFilter(events, ' ').map(event => {
    element.addEventListener(event, callback, options)
    return () => element.removeEventListener(event, callback, options)
  })

  return () => remove.forEach(cb => cb())
}
