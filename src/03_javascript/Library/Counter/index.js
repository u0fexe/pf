import Counter from './Counter.js'

export function findAllCounters() {
  return [...document.querySelectorAll('[data-counter]')].map(node => new Counter(node))
}

export function watchForNewCounters(container, cb) {
  container = container || document.body

  const observer = new MutationObserver((mutationsList) => {
    for(const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const counters = [...mutation.addedNodes].map(node => {
          if(node.hasAttribute && node.hasAttribute('data-counter')) {
            return new Counter(node)
          }
        }).filter(c => !!c)
        cb && cb(counters)
      }
    }
  })

  observer.observe(container, { childList: true, subtree: true })
}

export default Counter