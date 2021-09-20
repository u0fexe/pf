export default function() {
  document.documentElement.style.setProperty('--screen-width', document.documentElement.offsetWidth + 'px')
  document.documentElement.style.setProperty('--screen-height', innerHeight + 'px')
}