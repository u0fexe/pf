export default function(element, property, num) {
  const style = getComputedStyle(element)

  if(num) {
    return parseFloat(style.getPropertyValue(property))
  } else {
    return style.getPropertyValue(property)
  }
}