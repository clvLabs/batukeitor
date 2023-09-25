
import classNames from "https://cdn.skypack.dev/classnames/bind";
import * as Tone from "https://cdn.skypack.dev/tone";

export class AudioManager extends EventTarget {
  constructor() {
    super();
    this.instrumentMgr = undefined;
  }

  init(instrumentMgr) {
    this.instrumentMgr = instrumentMgr;

    for (const instrumentId in instrumentMgr.list) {
      const instrument = instrumentMgr.list[instrumentId];
      instrument.init();
    }

    Tone.loaded().then(() => {
      this.dispatchEvent(new Event('ready'));
    });

  }

}
