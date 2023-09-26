import {TimeSignature} from "./TimeSignature.js"
import {Track} from "./Track.js"

export class Section {
  constructor(id, ymlData, instrumentMgr) {
    this.id = id;
    this.name = ymlData.name;
    this.shortName = ymlData.shortName;
    this.color = ymlData.color;
    this.timeSignature = new TimeSignature(ymlData.timeSignature);
    this.instrumentMgr = instrumentMgr;
    this.tracks = {};

    for (const trackId in ymlData.tracks) {
      const ymlTrackNotes = ymlData.tracks[trackId];
      const instrument = this.instrumentMgr.list[trackId];
      this.tracks[trackId] = new Track(
        trackId,
        ymlTrackNotes,
        this.timeSignature,
        instrument);
    }

    const firstTrack = this.tracks[Object. keys(this.tracks)[0]];

    this.numSixteenths = firstTrack.numSixteenths;
    this.numBars = firstTrack.numBars;
  }

  getMetronomeDisplayStr() {
    return this.timeSignature.getMetronomeBarDisplayStr().repeat(this.numBars);
  }

}
