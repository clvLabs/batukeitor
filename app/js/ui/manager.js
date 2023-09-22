
export class UIManager extends EventTarget {
  constructor() {
    super();
  }

  init() {
    $("#app").show();
    $("#play-button").on("click", this.onPlayButton.bind(this));

    const canvas = $("#song-canvas")[0];
    const ctx = canvas.getContext("2d");
    var path = new Path2D('M 100,100 h 50 v 50 h 50');
    ctx.strokeStyle = "#6ab150";
    ctx.stroke(path);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(10, 10, 100, 100);
  }

  onPlayButton(e) {
    this.dispatchEvent(new Event('play'));
  }
}
