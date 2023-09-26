
export class TimeSignature {
  constructor(signature) {
    // const ACCEPTED_SIGNATURES = [
    //   "2/4", "3/4", "4/4", "6/8", "9/8" "12/8"
    // ];
    // if (!ACCEPTED_SIGNATURES.includes(signature)) {
    //   ERROR !!!!
    // }

    this.name = signature;

    const sigParts = signature.split("/");
    this.numBeats = parseInt(sigParts[0]);
    this.beatNote = parseInt(sigParts[1]);

    if (this.beatNote == 4) {
      this.sixteenthsPerBar = this.numBeats * 4;
    }
    else if (this.beatNote == 8) {
      this.sixteenthsPerBar = this.numBeats * 2;
    }
  }

  normalizeNumSixteenths(numSixteenths) {
    return this.getNumBars(numSixteenths) * this.sixteenthsPerBar;
  }

  getNumBars(numSixteenths) {
    return Math.ceil(numSixteenths / this.sixteenthsPerBar);
  }

  getTrackNumBars(track) {
    return this.getNumBars(track.numSixteenths);
  }

  getSectionNumBars(section) {
    var maxSixteenths = 0;

    for (const _trackId in section.tracks) {
      const _track = section.tracks[trackId];
      if (_track.numSixteenths > maxSixteenths)
        maxSixteenths = _track.numSixteenths;
    }

    return this.getNumBars(maxSixteenths);
  }

  isBarStart(pos) {
    return (pos % this.sixteenthsPerBar) == 0;
  }

  isBeatStart(pos) {
    if (this.beatNote == 4) {
      return (pos % 4) == 0;
    }
    else if (this.beatNote == 8) {
      return (pos % 6) == 0;
    }
  }

  isEighthNoteStart(pos) {
    return (pos % 2) == 0;
  }

  getMetronomeBarDisplayStr() {
    switch (this.name) {
      case "2/4":  return "1---2---";
      case "3/4":  return "1---2---3---";
      case "4/4":  return "1---2---3---4---";
      case "6/8":  return "1-----2-----";
      case "9/8":  return "1-----2-----3-----";
      case "12/8": return "1-----2-----3-----4-----";
      default: return `ERROR: Unknown time signature (${this.name})`;
    }
  }

}
