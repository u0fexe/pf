{
  const texts = [
    'loading your mom',
    'loading your dad',
    'loading your grandfather',
    'loading your grandmother',
  ]

  window.preloaderInfo = document.querySelector('.preloader__info')

  if(window.preloaderInfo) {
    window.preloaderInfo.innerText = texts[Math.floor(Math.random() * texts.length)]
  }
}