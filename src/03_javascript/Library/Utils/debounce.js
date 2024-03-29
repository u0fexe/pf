export default function(func, timeout = 300){
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(args), timeout)
  }
}