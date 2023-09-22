import {UIManager} from "./ui/UIManager.js"
import {CrewManager} from "./crew/CrewManager.js"
import {Score} from "./audio/score/Score.js"

const DEFAULT_CREWID = "btu-k";

export class BatukeitorApp {
  constructor() {
    this.crews = new CrewManager();
    this.crews.addEventListener("error", this.onCrewsError.bind(this));
    this.crews.addEventListener("loaded", this.onCrewsLoaded.bind(this));
    this.crew = undefined;

    this.ui = new UIManager(this.crews);
    this.ui.addEventListener("load", this.onUILoad.bind(this));
    this.ui.addEventListener("play", this.onUIPlay.bind(this));

    this.score = new Score();
    this.score.addEventListener("error", this.onScoreError.bind(this));
    this.score.addEventListener("loaded", this.onScoreLoaded.bind(this));
  }

  run() {
    this.crews.init();
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

  onUILoad(e) {
    this.score.load(this._getSongURL(e.detail.score));
  }

  onUIPlay() {
  }

  onScoreLoaded(e) {
    this.ui.setScore(this.score);
  }

  onScoreError(e) {
    // alert(`[Score] ERROR: ${e.detail.error}`);
    console.log(`[Score] ERROR: ${e.detail.error}`);
    this.ui.setScore(undefined);
  }

  _getSongURL(songName) {
    return `/data/crews/${this.crew.id}/scores/${songName}.yml`;
  }
}
