import {Instrument} from "./Instrument.js"

export class InstrumentManager extends EventTarget {
  constructor() {
    super();
    this.BASE_URL = "/data/instruments";
    this.list = {}
    this.instrumentsFileVersion = 1.0
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

    if (_ymlInstrumentList.instrumentsFileVersion != this.instrumentsFileVersion) {
      this._error(`[Instruments] Wrong file version in ${this.url}\n` +
            `Found ${_ymlInstrumentList.instrumntsFileVersion}, expecting ${this.instrumntsFileVersion}`);
      return;
    }

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
