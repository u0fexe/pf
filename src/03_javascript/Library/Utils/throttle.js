export default function throttle(fn, wait) {
  let time = Date.now()
  return function(e) {
    if ((time + wait - Date.now()) < 0) {
      fn(e)
      time = Date.now()
    }
  }
}