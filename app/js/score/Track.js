
export class Track {
  constructor(trackId, notes, timeSignature, instrument) {
    this.id = trackId;
    this.timeSignature = timeSignature;
    this.instrument = instrument;

    this.numSixteenths = timeSignature.normalizeNumSixteenths(notes.length);
    this.notesStr = notes.padEnd(this.numSixteenths, " ");

    this.numBars = timeSignature.getNumBars(this.numSixteenths);
  }
}
