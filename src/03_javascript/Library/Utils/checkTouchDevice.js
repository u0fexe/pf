export default function() {
  return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0))
}