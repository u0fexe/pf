export default function (element) {
  const height = element.getBoundingClientRect().height
  const css = window.getComputedStyle(element)
  const margins = ['top', 'bottom'].map(side => parseInt(css['margin-' + side]), 10)
  const total = margins.reduce((total, side) => total + side, height)

  return total
}