export default class YouTube {
  constructor() {
    this.createScript()
    this.shapePlayers()
    window.onYouTubeIframeAPIReady = () => this.initializePlayers()
  }

  createScript() {
    const tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }

  shapePlayers() {
    this.players = [...document.querySelectorAll('[data-youtube]')].map(container => {
      const videoId = container.getAttribute('data-youtube')
      return {
        container,
        videoId,
        self: null,
        ready: false,
        readyCallback: null,
        onReady() {
          this.ready = true
          this.readyCallback && this.readyCallback()
        },
        load() {
          if(this.ready) {
            this.self.loadVideoById(this.videoId)
            this.self.stopVideo()
          } else {
            this.readyCallback = () => {
              this.self.loadVideoById(this.videoId)
              this.self.stopVideo()
            }
          }
        }
      }
    })
  }

  initializePlayers() {
    this.players.forEach(player => {
      player.self = new YT.Player(player.container, {
        videoId: null,
        playerVars: { 'autoplay': 0, 'controls': 1 },
        events: { 'onReady': player.onReady.bind(player) }
      })
    })
  }

  loadVideos() {
    this.players.forEach(player => player.load())
  }
}