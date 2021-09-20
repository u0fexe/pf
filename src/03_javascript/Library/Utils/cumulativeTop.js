export default function(element, except) {
  let top = 0

  do {
    top += element.offsetTop || 0
    element = element.offsetParent
  } while (element && element !== except)


  return top
}