
export class Score extends EventTarget {
  constructor() {
    super();
    this.version = 2.0;
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
      self._parseYAML(data);
    }).fail(function() {
      self._error(`[Score] ERROR loading ${url}`);
    });
  }

  _error(msg) {
    this.dispatchEvent(new CustomEvent('error',
      {detail: { error: msg }}));
  }

  _parseYAML(ymlData) {
    this._ymlScore = jsyaml.load(ymlData);
    this.loaded = true;

    if (this._ymlScore.scoreVersion != this.version) {
      this._error(`[Score] Wrong score version in ${this.url}\n` +
            `Found ${this._ymlScore.scoreVersion}, expecting ${this.version}`);
      return;
    }

    this.name = this._ymlScore.name;
    this.bpm = this._ymlScore.bpm;
    this.intro = this._ymlScore.intro;
    this.song = this._ymlScore.song;
    this.end = this._ymlScore.end;
    this.sections = this._ymlScore.sections;

    this.dispatchEvent(new Event('loaded'));
  }
}
