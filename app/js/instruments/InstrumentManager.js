import {Instrument} from "./Instrument.js"

export class InstrumentManager extends EventTarget {
  constructor() {
    super();
    this.BASE_URL = "./data/instruments";
    this._list = {}
  }

  init() {
    const self = this;
    $.get(this._getInstrumentListURL()).done(function(data) {
      try {
        self._parseInstrumentList(data);
      } catch (error) {
        self._error(`[Instrument] ERROR processing instrument list: ${error}`);
      }
    }).fail(function() {
      self._error(`[Instrument] ERROR loading instrument list: ${url}`);
    });
  }

  all() {
    return this._list;
  }

  get(instrumentId) {
    return this._list[instrumentId];
  }

  _error(msg) {
    this.dispatchEvent(new CustomEvent('error',
      {detail: { error: msg }}));
  }

  _parseInstrumentList(ymlData) {
    var _ymlInstrumentList;
    try {
      _ymlInstrumentList = jsyaml.load(ymlData);
    } catch (error) {
      this._error(`[Instrument] ERROR: Invalid data in instruments file - ${error}`);
      return;
    }
    this.loaded = true;

    for (const instrumentId in _ymlInstrumentList.instruments)
    {
      const instrumentData = _ymlInstrumentList.instruments[instrumentId];
      this._list[instrumentId] = new Instrument(instrumentId, instrumentData);
    }

    this.dispatchEvent(new Event('ready'));
  }

  _getInstrumentListURL() {
    return `${this.BASE_URL}/instruments.yml?ts=${Date.now()}`;
  }

}
