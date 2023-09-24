
export class Score extends EventTarget {
  constructor() {
    super();
    this.scoreFileVersion = 1.0;
    this._reset();
  }

  _reset() {
    this.url = undefined;
    this._ymlScore = undefined;
    this.loaded = false;
    this.name = undefined;
    this.bpm = undefined;
    this.intro = undefined;
    this.song = undefined;
    this.end = undefined;
    this.sections = undefined;
  }

  load(url) {
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
    this.intro = this._ymlScore.intro;
    this.song = this._ymlScore.song;
    this.end = this._ymlScore.end;
    this.sections = this._ymlScore.sections;

    if ( this.name == undefined
      || this.bpm == undefined
      // || this.intro == undefined
      // || this.song == undefined
      // || this.end == undefined
      || this.sections == undefined
      ){
        this._error(`[Score] ERROR: Invalid data in ${this.url}`);
        return;
      }

    this.dispatchEvent(new Event('loaded'));
  }
}
