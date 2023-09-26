import * as Tone from "https://cdn.skypack.dev/tone";

export class Sample extends EventTarget {
  constructor(id, fileName) {
    super();
    this.BASE_URL = "/data/instruments";
    this.id = id;
    this.fileName = fileName;
    this.url = `${this.BASE_URL}/samples/${fileName}`;
    this.player = undefined;
  }

  init() {
    this.player = new Tone.Player(this.url).toDestination();
  }

  play() {
    Tone.loaded().then(() => {
      this.player.start();
    });
  }

}
