
export class Track {
  constructor(id, notes, timeSignature, instrument) {
    this.id = id;
    this.timeSignature = timeSignature;
    this.instrument = instrument;

    notes = notes.trimEnd();
    this.numSixteenths = timeSignature.normalizeNumSixteenths(notes.length);
    this.length = this.numSixteenths;  // alias!
    this.notesStr = notes.padEnd(this.numSixteenths, " ");

    this.samples = [];
    for (const index in this.notesStr) {
      const sampleId = this.notesStr[index];
      const sample = instrument.samples[sampleId];
      this.samples.push( sample );
    }

    this.numBars = timeSignature.getNumBars(this.numSixteenths);
  }
}
