import {AudioManager} from "./audio/AudioManager.js"
import {CrewManager} from "./crew/CrewManager.js"
import {InstrumentManager} from "./instruments/InstrumentManager.js"
import {UIManager} from "./ui/UIManager.js"
import {Score} from "./score/Score.js"

const DEFAULT_CREWID = "btu-k";

export class BatukeitorApp {
  constructor() {
    this.audioMgr = new AudioManager();
    this.audioMgr.addEventListener("ready", this.onAudioManagerReady.bind(this));
    this.audioMgr.addEventListener("error", this.onAudioManagerError.bind(this));

    this.crewMgr = new CrewManager();
    this.crewMgr.addEventListener("ready", this.onCrewManagerReady.bind(this));
    this.crewMgr.addEventListener("error", this.onCrewManagerError.bind(this));
    this.crew = undefined;

    this.instrumentMgr = new InstrumentManager();
    this.instrumentMgr.addEventListener("ready", this.onInstrumentManagerReady.bind(this));
    this.instrumentMgr.addEventListener("error", this.onInstrumentManagerError.bind(this));

    this.uiMgr = new UIManager(this.crewMgr);
    this.uiMgr.addEventListener("load", this.onUIManagerLoad.bind(this));
    this.uiMgr.addEventListener("play", this.onUIManagerPlay.bind(this));
    this.uiMgr.addEventListener("playSample", this.onUIManagerPlaySample.bind(this));

    this.score = new Score(this.instrumentMgr);
    this.score.addEventListener("ready", this.onScoreReady.bind(this));
    this.score.addEventListener("error", this.onScoreError.bind(this));
  }

  run() {
    this.crewMgr.init();
    this.instrumentMgr.init();
  }

  onAudioManagerReady() {
  }

  onAudioManagerError(e) {
    alert(`[Audio] ERROR: ${e.detail.error}`);
  }

  onCrewManagerReady() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var crewId = urlParams.get('crew');
    if (crewId == null)
      crewId = DEFAULT_CREWID;

    this.crew = this.crewMgr.get(crewId);
    if (this.crew == null) {
      alert(`[Crews] Crew not found: ${crewId}`);
    } else {
      this.uiMgr.init(crewId);
    }
  }

  onCrewManagerError(e) {
    alert(`[Crews] ERROR: ${e.detail.error}`);
  }

  onInstrumentManagerReady() {
    this.uiMgr.setInstrumentManager(this.instrumentMgr);
    this.audioMgr.init(this.instrumentMgr);
  }

  onInstrumentManagerError(e) {
    this.uiMgr.setInstrumentManager(undefined, e.detail.error);
  }

  onUIManagerLoad(e) {
    this.score.load(this.crew.id, e.detail.scoreId);
  }

  onUIManagerPlay() {
  }

  onUIManagerPlaySample(e) {
    this.instrumentMgr.list[e.detail.instrumentId].play(e.detail.sampleId);
  }

  onScoreReady(e) {
    this.uiMgr.setScore(this.score);
  }

  onScoreError(e) {
    this.uiMgr.setScore(undefined, e.detail.error);
  }
}
