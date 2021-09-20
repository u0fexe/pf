export default function(element, except) {
  let left = 0

  do {
    left += element.offsetLeft || 0
    element = element.offsetParent
  } while (element  && element !== except)

  return left
}