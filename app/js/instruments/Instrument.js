import * as Tone from "https://cdn.skypack.dev/tone";
import {Sample} from "./Sample.js"

export class Instrument extends EventTarget {
  constructor(instrumentId, ymlInstrumentData) {
    super();
    this.BASE_URL = "/data/instruments";
    this.id = instrumentId;
    this.name = ymlInstrumentData.name;
    this.iconURL = `${this.BASE_URL}/img/${this.id}.png`;
    this.samples = {};

    for (const sampleId in ymlInstrumentData.samples) {
      const fileName = ymlInstrumentData.samples[sampleId];

      this.samples[sampleId] = new Sample(sampleId, fileName);
    }
  }

  init() {
    for (const sampleId in this.samples) {
      const sample = this.samples[sampleId];
      sample.init();
    }
  }

  play(sampleId) {
    Tone.loaded().then(() => {
      this.samples[sampleId].play();
    });
  }

}
