import {TimeSignature} from "./TimeSignature.js"
import {Track} from "./Track.js"

export class Section {
  constructor(id, ymlData, instrumentMgr) {
    this.id = id;
    this.name = ymlData.name;
    this.color = ymlData.color;
    this.timeSignature = new TimeSignature(ymlData.timeSignature);
    this.instrumentMgr = instrumentMgr;
    this.tracks = {};
    var _tmpTracks = {};

    if (this.color[0] == "#")
    this.color = this.color.substring(1);

    for (const trackId in ymlData.tracks) {
      const ymlTrackNotes = ymlData.tracks[trackId];
      const instrument = this.instrumentMgr.list[trackId];
      _tmpTracks[trackId] = new Track(
        trackId,
        ymlTrackNotes,
        this.timeSignature,
        instrument);
    }

    // Calculate number of Sixteenths/Bars/Beats
    this.numSixteenths = 0;
    this.numBars = 0;
    this.numBeats = 0;

    Object.values(_tmpTracks).forEach(track => {
      if (track.numSixteenths > this.numSixteenths) {
        this.numSixteenths = track.numSixteenths;
        this.numBars = track.numBars;
        this.numBeats = track.numBeats;
      }
    });

    // Add metronome track to "definitive" list
    this.tracks["MT"] = new Track(
      "MT",
      this.timeSignature.getMetronomeBarDisplayStr().repeat(this.numBars),
      this.timeSignature,
      this.instrumentMgr.list["MT"]);

    // Add rest of tracks to "definitive" list
    Object.values(_tmpTracks).forEach(track => {
      this.tracks[track.id] = track;
    });

  }

  getMetronomeDisplayStr() {
    return this.timeSignature.getMetronomeBarDisplayStr().repeat(this.numBars);
  }

}
