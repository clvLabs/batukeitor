import {UIManager} from "./ui/UIManager.js"
import {CrewManager} from "./crew/CrewManager.js"
import {InstrumentManager} from "./audio/instruments/InstrumentManager.js"
import {Score} from "./audio/score/Score.js"

const DEFAULT_CREWID = "btu-k";

export class BatukeitorApp {
  constructor() {
    this.crews = new CrewManager();
    this.crews.addEventListener("loaded", this.onCrewsLoaded.bind(this));
    this.crews.addEventListener("error", this.onCrewsError.bind(this));
    this.crew = undefined;

    this.instruments = new InstrumentManager();
    this.instruments.addEventListener("loaded", this.onInstrumentsLoaded.bind(this));
    this.instruments.addEventListener("error", this.onInstrumentsError.bind(this));

    this.ui = new UIManager(this.crews);
    this.ui.addEventListener("load", this.onUILoad.bind(this));
    this.ui.addEventListener("play", this.onUIPlay.bind(this));

    this.score = new Score();
    this.score.addEventListener("loaded", this.onScoreLoaded.bind(this));
    this.score.addEventListener("error", this.onScoreError.bind(this));
  }

  run() {
    this.crews.init();
    this.instruments.init();
  }

  onCrewsLoaded() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var crewId = urlParams.get('crew');
    if (crewId == null)
      crewId = DEFAULT_CREWID;

    this.crew = this.crews.list[crewId];
    if (this.crew == null) {
      alert(`[Crews] Crew not found: ${crewId}`);
    } else {
      this.ui.init(crewId);
    }
  }

  onCrewsError(e) {
    alert(`[Crews] ERROR: ${e.detail.error}`);
  }

  onInstrumentsLoaded() {
    this.ui.setInstruments(this.instruments);
  }

  onInstrumentsError(e) {
    this.ui.setInstruments(undefined, e.detail.error);
  }

  onScoreLoaded(e) {
    this.ui.setScore(this.score);
  }

  onScoreError(e) {
    this.ui.setScore(undefined, e.detail.error);
  }

  _getScoreURL(scoreId) {
    return `/data/crews/${this.crew.id}/scores/${scoreId}.yml`;
  }

  onUILoad(e) {
    this.score.load(this._getScoreURL(e.detail.scoreId));
  }

  onUIPlay() {
  }
}
