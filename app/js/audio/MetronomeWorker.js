
class MetronomeWorker {
  constructor() {
    this.timerId = null;
    this.interval = 100;
    this.started = false;
    postMessage("ready")
  }

  onmessage(e) {
    console.log("[MetronomeWorker] onmessage!");

    if (e.data.cmd == "start") {
      this._start();
    } else if (e.data.cmd == "stop") {
      this._stop();
    } else if (e.data.cmd == "setBPM") {
      this._setBPM(e.data.bpm);
    }
  }

  _start() {
    console.log("[MetronomeWorker] starting");
    this.timerId = setInterval(this._tick.bind(this),this.interval)
    this.started = true;
  }

  _stop() {
    console.log("[MetronomeWorker] stopping");
    clearInterval(this.timerId);
    this.timerId = null;
    this.started = false;
  }

  _setBPM(bpm) {
    this.interval = 60000 / bpm / 16;  // TO-DO: Check !!!!
    console.log(`[MetronomeWorker] setBPM(${bpm}) - interval: ${this.interval}`);
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = setInterval(this._tick.bind(this),this.interval)
    }
  }

  _tick() {
    postMessage("tick");
  }

}

console.log(`[MetronomeWorker] Initializing MetronomeWorker`);
_worker = new MetronomeWorker();
self.onmessage = (e) => { _worker.onmessage(e) };
