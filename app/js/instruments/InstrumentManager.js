import {Instrument} from "./Instrument.js"

export class InstrumentManager extends EventTarget {
  constructor() {
    super();
    this.BASE_URL = "/data/instruments";
    this.list = {}
  }

  init() {
    const self = this;
    $.get(this._getInstrumentListURL()).done(function(data) {
      self._parseInstrumentList(data);
    }).fail(function() {
      self._error(`[Instrument] ERROR loading instrument list: ${url}`);
    });
  }

  _error(msg) {
    this.dispatchEvent(new CustomEvent('error',
      {detail: { error: msg }}));
  }

  _parseInstrumentList(ymlData) {
    const _ymlInstrumentList = jsyaml.load(ymlData);
    this.loaded = true;

    for (const instrumentId in _ymlInstrumentList.instruments)
    {
      const instrumentData = _ymlInstrumentList.instruments[instrumentId];
      this.list[instrumentId] = new Instrument(instrumentId, instrumentData);
    }

    this.dispatchEvent(new Event('ready'));
  }

  _getInstrumentListURL() {
    return `${this.BASE_URL}/instruments.yml`;
  }

}
