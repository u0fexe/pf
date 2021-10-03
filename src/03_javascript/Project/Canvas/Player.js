import { AudioLoader, AudioListener, Audio } from "three"

export default class Player {
  constructor(camera) {
    this.listener = new AudioListener()
    camera.add( this.listener )
    this.audioLoader = new AudioLoader()
    this.sound = new Audio(this.listener)
    this.playing = false
  }

  play(fileName) {
    if(this.playing) return this.stop()

    this.audioLoader.load(`multimedia/audio/${fileName}.mp3`, buffer => {
       this.sound.setBuffer( buffer )
       this.sound.setLoop( true )
       this.sound.setVolume( 0.5 )
       this.sound.play()
    })

    this.playing = true
  }


  stop() {
    this.sound.pause()
    this.playing = false
  }

}