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

    this.numSixteenths = 0;
    this.numBars = 0;
    this.numBeats = 0;

    Object.values(this.tracks).forEach(track => {
      if (track.numSixteenths > this.numSixteenths) {
        this.numSixteenths = track.numSixteenths;
        this.numBars = track.numBars;
        this.numBeats = track.numBeats;
      }
    });
  }

  getMetronomeDisplayStr() {
    return this.timeSignature.getMetronomeBarDisplayStr().repeat(this.numBars);
  }

}
