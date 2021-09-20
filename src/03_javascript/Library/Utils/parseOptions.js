import cache from '../Tools/Cache.js'
import splitTrimFilter from "./splitTrimFilter.js"

export function parseStringArray(string) {
  const firstChar = string.slice(0, 1)
  const lastChar = string.slice(-1)

  let res = string

  if(firstChar === '[' && lastChar === ']') {
    res = splitTrimFilter(string.slice(1, -1), '|').map(item => {
      if(item === 'true') item = true
      else if(item === 'false') item = false
      else if(!isNaN(item)) item = +item
      return item
    })
  }

  return res
}

export default function parseOptions(stringOptions , defaultOptions = {}, el, icache) {
  stringOptions = stringOptions || ''
  icache = cache || icache || {}

  if(icache.aliases[stringOptions]) return icache.aliases[stringOptions]

  const options = {}

  splitTrimFilter(stringOptions, ',').forEach(option => {
    const parts = splitTrimFilter(option.trim(), '::')

    if(parts[0] === 'target') {
      let target = null

      if(parts[1] === 'self' && el) {
        target = el
      }

      else if(parts[1] === 'parent' && el) {
        target = el.parentElement
      }

      else {
        target = icache.findElement(parts[1])
      }

      options[parts[0]] = target || el
    }

    else if(parts[0] === 'targets' && parts[1]) {
      const aliased = icache.findAlias(parts[1])
      if(aliased) return options[parts[0]] = aliased

      const selectors = parseStringArray(parts[1])
      const targets = selectors.map(selector => icache.findElement(selector))
      options[parts[0]] = icache.aliases[parts[1]] = targets
    }

    else if(parts[1] === 'false') {
      options[parts[0]] = false
    }

    else if(parts[1] === 'true') {
      options[parts[0]] = true
    }

    else if(isNaN(parts[1]) ) {
      if(parts[1] && parts[1].charAt(0) === '[') {
        const aliased = icache.findAlias(parts[1])
        if(aliased) return options[parts[0]] = aliased
        icache.aliases[parts[1]] = options[parts[0]] = parseStringArray(parts[1])
      }

      else if(parts[1]) {
        options[parts[0]] = parts[1]
      }

      else {
        options[parts[0]] = true
      }
    }

    else if(!isNaN(parts[1])){
      options[parts[0]] = +parts[1]
    }
  })

  for(const member in defaultOptions) {
    options[member] = options[member] || options[member] === 0 ? options[member] : defaultOptions[member]
  }
  icache.aliases[stringOptions] = options
  return options
}