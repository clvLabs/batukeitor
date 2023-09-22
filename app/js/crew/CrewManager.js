
export class CrewManager extends EventTarget {
  constructor() {
    super();
    this.BASE_URL = "/data/crews";
    this.list = {}
    this.crewsFileVersion = 1.0
    this.selectedCrew = undefined;
  }

  init() {
    const self = this;
    $.get(this._getCrewListURL()).done(function(data) {
      self._parseCrewList(data);
    }).fail(function() {
      self._error(`[Crew] ERROR loading crew list: ${url}`);
    });
  }

  select(crewId) {
    this.selectedCrew = this.list[crewId];
  }

  _error(msg) {
    this.dispatchEvent(new CustomEvent('error',
      {detail: { error: msg }}));
  }

  _parseCrewList(ymlData) {
    const _ymlCrewList = jsyaml.load(ymlData);
    this.loaded = true;

    if (_ymlCrewList.crewsFileVersion != this.crewsFileVersion) {
      this._error(`[Crews] Wrong file version in ${this.url}\n` +
            `Found ${_ymlCrewList.crewsFileVersion}, expecting ${this.crewsFileVersion}`);
      return;
    }

    for (const crewId in _ymlCrewList.crews)
    {
      const crew = _ymlCrewList.crews[crewId];
      this.list[crewId] = {
        id: crewId,
        name: crew.name,
        scores: crew.scores,
      };
    }

    this.dispatchEvent(new Event('loaded'));
  }

  _getCrewListURL() {
    return `${this.BASE_URL}/crews.yml`;
  }

}
