import {Section} from "./Section.js"

export class Score extends EventTarget {
  constructor(instrumentMgr) {
    super();
    this.DEFAULT_BPM = 90;
    this.instrumentMgr = instrumentMgr;
    this.scoreFileVersion = 1.0;
    this._reset();
  }

  _reset() {
    this.url = undefined;
    this._ymlScore = undefined;
    this.loaded = false;
    this.name = undefined;
    this.bpm = undefined;
    this.song = undefined;
    this.sections = undefined;
  }

  load(crewId, scoreId) {
    const url = this._getScoreURL(crewId, scoreId);
    this._reset();
    this.url = url;
    const noCacheURL = `${url}?ts=${Date.now()}`;

    const self = this;
    $.get(noCacheURL).done(function(data) {
      self._parseScore(data);
    }).fail(function(e) {
      self._error(`[Score] ERROR loading ${url} (${e.statusText})`);
    });
  }

  _error(msg) {
    this.dispatchEvent(new CustomEvent('error',
      {detail: { error: msg }}));
  }

  _parseScore(ymlData) {
    this._ymlScore = jsyaml.load(ymlData);
    this.loaded = true;

    if (this._ymlScore.scoreFileVersion != this.scoreFileVersion) {
      this._error(`[Score] Wrong score version in ${this.url}\n` +
            `Found ${this._ymlScore.scoreFileVersion}, expecting ${this.scoreFileVersion}`);
      return;
    }

    this.name = this._ymlScore.name;
    this.bpm = this._ymlScore.bpm;
    this.song = this._ymlScore.song;

    this.sections = {};
    for (const sectionId in this._ymlScore.sections) {
      const _ymlSectionData = this._ymlScore.sections[sectionId];
      this.sections[sectionId] = new Section(sectionId, _ymlSectionData, this.instrumentMgr);
    }

    if ( this.bmp == undefined )
      this.bpm = this.DEFAULT_BPM;

    if ( this.name == undefined
      || this.sections == undefined
      ){
        this._error(`[Score] ERROR: Invalid data in ${this.url}`);
        return;
      }

    this.dispatchEvent(new Event('ready'));
  }

  _getScoreURL(crewId, scoreId) {
    return `/data/crews/${crewId}/scores/${scoreId}.yml`;
  }
}
