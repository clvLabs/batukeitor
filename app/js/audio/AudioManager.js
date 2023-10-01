import * as Tone from "https://cdn.skypack.dev/tone";
import {Metronome} from "./Metronome.js"

export class AudioManager extends EventTarget {
  constructor() {
    super();
    this.instrumentMgr = undefined;
    this.metronome = new Metronome();
  }

  init(instrumentMgr) {
    this.instrumentMgr = instrumentMgr;

    for (const instrumentId in instrumentMgr.all()) {
      const instrument = instrumentMgr.get(instrumentId);
      instrument.init();
    }

    Tone.loaded().then(() => {
      this.dispatchEvent(new Event('ready'));
    });
  }

  setBPM(bpm) {
    this.metronome.setBPM(bpm);
  }

  play() {
    this.metronome.start();
  }

  stop() {
    this.metronome.stop();
  }

}
