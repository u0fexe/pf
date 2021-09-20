export default function(element) {
  const width = element.getBoundingClientRect().width
  const css = window.getComputedStyle(element)
  const margins = ['left', 'right'].map(side => parseInt(css['margin-' + side]), 10)
  const total = margins.reduce((total, side) => total + side, width)

  return total
}