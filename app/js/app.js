import {UIManager} from "./ui/manager.js"
import {Score} from "./audio/score/score.js"

export class BatukeitorApp {
  constructor() {
    this.ui = new UIManager();
    this.ui.addEventListener("play", this.onUIPlay.bind(this));

    this.score = new Score();
    this.score.addEventListener("error", this.onScoreError.bind(this));
    this.score.addEventListener("loaded", this.onScoreLoaded.bind(this));
  }

  run() {
    this.ui.init();
  }

  onUIPlay() {
    this.score.load("/data/scores/btu-k/funky.yml");
  }

  onScoreError(e) {
    alert(e.detail.error);
  }

  onScoreLoaded(e) {
    console.log(`SCORE LOADED \nName: ${this.score.name} \nSong: ${this.score.song}`);
    console.log(this.score._ymlScore);
  }
}
