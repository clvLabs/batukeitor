
export class CrewManager extends EventTarget {
  constructor() {
    super();
    this.BASE_URL = "/data/crews";
    this._list = {}
    this._loadPendingCrews = [];
    this.selectedCrew = undefined;
  }

  init() {
    const self = this;
    $.get(this._getCrewListURL()).done(function(data) {
      self._parseCrewList(data);
    }).fail(function() {
      self._error(`[Crews] ERROR loading crew list: ${url}`);
    });
  }

  all() {
    return this._list;
  }

  get(crewId) {
    return this._list[crewId];
  }

  getFirstCrewId() {
    return Object.keys(this._list)[0];
  }

  select(crewId) {
    this.selectedCrew = this._list[crewId];
  }

  _error(msg) {
    this.dispatchEvent(new CustomEvent('error',
      {detail: { error: msg }}));
  }

  _parseCrewList(ymlData) {
    const _ymlCrewList = jsyaml.load(ymlData);
    this.loaded = true;

    for (const crewId of _ymlCrewList.crews)
    {
      this._loadPendingCrews.push(crewId);

      const self = this;
      $.get(this._getCrewDataURL(crewId)).done(function(data) {
        self._parseCrewData(crewId, data);
      }).fail(function() {
        self._error(`[Crews] ERROR loading crew data: ${url}`);
      }).always(function() {
        self._loadPendingCrews = self._loadPendingCrews.filter(id => id != crewId);

        if (self._loadPendingCrews.length == 0)
          self.dispatchEvent(new Event('ready'));
      });
    }
  }

  _parseCrewData(crewId, ymlData) {
    const _ymlCrewData = jsyaml.load(ymlData);
    this._list[crewId] = {
      id: crewId,
      name: _ymlCrewData.name,
      scores: _ymlCrewData.scores,
    };
  }

  _getCrewListURL() {
    return `${this.BASE_URL}/index.yml`;
  }

  _getCrewDataURL(crewId) {
    return `${this.BASE_URL}/${crewId}/index.yml`;
  }

}
