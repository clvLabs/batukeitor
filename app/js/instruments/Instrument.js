import classNames from "https://cdn.skypack.dev/classnames/bind";
import * as Tone from "https://cdn.skypack.dev/tone";

export class Instrument extends EventTarget {
  constructor(instrumentId, ymlInstrumentData) {
    super();
    this.BASE_URL = "/data/instruments";
    this.id = instrumentId;
    this.name = ymlInstrumentData.name;
    this.iconURL = `${this.BASE_URL}/img/${this.id}.png`;
    this.samples = {};

    for (const sampleKey in ymlInstrumentData.samples) {
      const fileName = ymlInstrumentData.samples[sampleKey];

      this.samples[sampleKey] = {
        id: sampleKey,
        fileName: fileName,
        URL: `${this.BASE_URL}/samples/${fileName}`,
        player: undefined,
      }
    }
  }

  init() {
    for (const sampleId in this.samples) {
      const sample = this.samples[sampleId];
      sample.player = new Tone.Player(sample.URL).toDestination();
    }
  }

  play(sampleId) {
    Tone.loaded().then(() => {
      this.samples[sampleId].player.start();
    });
  }

}
