
export class Metronome extends EventTarget {
  constructor() {
    super();
    this.timerId = null;
    this.interval = 100;
    this.worker = new Worker("/app/js/audio/MetronomeWorker.js");
    this.worker.onmessage = this._onWorkerMessage.bind(this);
    this.workerReady = false;
  }

  setBPM(bpm) {
    if (!this.workerReady) {
      console.log("ERROR: setBPM() - Worker not ready yet");
      return;
    }

    this.worker.postMessage({cmd: "setBPM", bpm: bpm});
  }

  start() {
    if (!this.workerReady) {
      console.log("ERROR: start() - Worker not ready yet");
      return;
    }

    if (this.worker.started) {
      console.log("WARNING: Worker already started");
      return;
    }

    console.log(`[Metronome] Starting MetronomeWorker`);
    this.worker.postMessage({cmd: "start"});
  }

  stop() {
    if (!this.workerReady) {
      console.log("ERROR: stop() - Worker not ready yet");
      return;
    }

    if (!this.worker.started) {
      console.log("WARNING: Worker already stopped");
      return;
    }

    console.log(`[Metronome] Starting MetronomeWorker`);
    this.worker.postMessage({cmd: "stop"});
  }

  _onWorkerMessage(e) {
    if (e.data == "ready") {
      this._onWorkerReady();
    } else if (e.data == "tick") {
      this._onWorkerTick();
    } else {
      this._onWorkerUnknownMessage(e);
    }
  }

  _onWorkerReady() {
    this.workerReady = true;
  }

  _onWorkerTick() {
    this._runScheduler();
  }

  _onWorkerUnknownMessage(e) {
    console.log("[Metronome] UNKNOWN message from MetronomeWorker: ", e);
  }

  _runScheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    //   while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    //     scheduleNote( current16thNote, nextNoteTime );
    //     nextNote();
    // }
    console.log("[Metronome] tick!");
}
}

/*
var audioContext = null;
var unlocked = false;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 120.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
var canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages


// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = window.requestAnimationFrame;

function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution==1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution==2) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes

    // create an oscillator
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    if (beatNumber % 16 === 0)    // beat 0 == high pitch
        osc.frequency.value = 880.0;
    else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
        osc.frequency.value = 440.0;
    else                        // other 16th notes = low pitch
        osc.frequency.value = 220.0;

    osc.start( time );
    osc.stop( time + noteLength );
}

function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}

function play() {
    if (!audioContext)
        audioContext = new AudioContext();

    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }

    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0,0);
}

function draw() {
    var currentNote = last16thNoteDrawn;
    if (audioContext) {
        var currentTime = audioContext.currentTime;

        while (notesInQueue.length && notesInQueue[0].time < currentTime) {
            currentNote = notesInQueue[0].note;
            notesInQueue.splice(0,1);   // remove note from queue
        }

        // We only need to draw if the note has moved.
        if (last16thNoteDrawn != currentNote) {
            var x = Math.floor( canvas.width / 18 );
            canvasContext.clearRect(0,0,canvas.width, canvas.height);
            for (var i=0; i<16; i++) {
                canvasContext.fillStyle = ( currentNote == i ) ?
                    ((currentNote%4 === 0)?"red":"blue") : "black";
                canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
            }
            last16thNoteDrawn = currentNote;
        }
    }
    // set up to draw again
    requestAnimFrame(draw);
}

function init(){
    var container = document.createElement( 'div' );

    container.className = "container";
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild( container );
    container.appendChild(canvas);
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;

    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;

    requestAnimFrame(draw);    // start the drawing loop.

    timerWorker = new Worker("js/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});
}

window.addEventListener("load", init );
*/