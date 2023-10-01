import * as Tone from "https://cdn.skypack.dev/tone";
import {Metronome} from "./Metronome.js"

export class AudioManager extends EventTarget {
  constructor() {
    super();
    this.audioContext = undefined;
    this.audioContextUnlocked = false;
    this.instrumentMgr = undefined;
    this.metronome = new Metronome(this._tick.bind(this));
    this.score = undefined;
    this.section = undefined;
    this.bpm = 1;
    this.sectionMode = false;
    this.current16th = 0;
    this.max16th = 0;
    this.nextNoteTime = 0.0;
    this.scheduleAheadTime = 0.1;
  }

  init(instrumentMgr) {
    this.instrumentMgr = instrumentMgr;

    Object.values(instrumentMgr.all()).forEach(instrument => {
      instrument.init();
    });

    Tone.loaded().then(() => {
      this.dispatchEvent(new Event('ready'));
    });
  }

  setBPM(bpm) {
    this.bpm = bpm;
    this.metronome.setBPM(bpm);
  }

  playScore(score) {
    this.score = score;
    this.sectionMode = false;
    this.max16th = score.num16ths;
    this._play();
  }

  playSection(score, section) {
    this.score = score;
    this.section = section;
    this.sectionMode = true;
    this.max16th = section.num16ths;
    this._play();
  }

  stop() {
    this.metronome.stop();
  }

  _play() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (!this.audioContextUnlocked) {
      // play silent buffer to unlock the audio
      var node = this.audioContext.createBufferSource();
      node.buffer = this.audioContext.createBuffer(1, 1, 22050);
      node.start(0);
      this.audioContextUnlocked = true;
    }

    this.current16th = 0;
    this.nextNoteTime = this.audioContext.currentTime;

    this.metronome.start();
  }

  _tick() {
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
      this._scheduleNote( this.current16th, this.nextNoteTime );
      this._nextNote();
    }
  }

  _scheduleNote( current16th, time ) {
    var _section;
    var _index;
    if (this.sectionMode) {
      _section = this.section;
      _index = current16th;
    } else {
      _section = this.score.getScoreSectionBy16thIndex(current16th);
      _index = this.score.get16thScoreSectionOffset(current16th);
    }

    Object.values(_section.tracks).forEach(track => {
      const sample = track.samples[_index];
      if (sample) {
        sample.play(time);
      }
    });
  }

  _nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    this.current16th++;
    if (this.current16th == this.max16th) {
      this.current16th = 0;
    }
  }

}
