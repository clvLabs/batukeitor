
export class UIManager extends EventTarget {
  constructor(crews) {
    super();
    this.crews = crews;
    this.score = undefined;
  }

  init(crewId) {
    $("#app").show();
    $("#play-button").prop('disabled', true)
    $("#play-button").on("click", this.onPlayButton.bind(this));
    $("#crew-selector").on("input", this.onCrewSelectorInput.bind(this));
    $("#score-selector").on("input", this.onScoreSelectorInput.bind(this));

    var crew;

    for (const _crewId in this.crews.list) {
      crew = this.crews.list[_crewId];

      if (_crewId == crewId)
        $("#crew-info-name").text(crew.name);

      $("#crew-selector").append(
        $("<option>",{
          value: _crewId,
          text: crew.name,
          selected: (_crewId == crewId),
        })
      );
    }

    crew = this.crews.list[crewId];
    for (const _scoreIndex in crew.scores) {
      const _scoreName = crew.scores[_scoreIndex]
      $("#score-selector").append(
        $("<option>",{
          value: _scoreName,
          text: _scoreName,
        })
      );
    }

    this.onScoreSelectorInput();

    const canvas = $("#song-canvas")[0];
    const ctx = canvas.getContext("2d");
    var path = new Path2D('M 100,100 h 50 v 50 h 50');
    ctx.strokeStyle = "#6ab150";
    ctx.stroke(path);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(10, 10, 100, 100);
  }

  setScore(score) {
    this.score = score;
    var errorsFound = false;

    if (score == undefined) {
      errorsFound = true;
      $("#score").text("Cannot load score");
      $("#current-section").text("");
      $("#play-button").prop('disabled', true)
    } else {
      console.log(this.score._ymlScore);
      $("#score").text(`BPM: ${score.bpm} Score: ${score.song}`);

      var currentSectionTxt = "";

      if (score.sections == null) {
        errorsFound = true;
        currentSectionTxt = "Section not found";
      } else {
        const section = score.sections['a'] ?? null;
        currentSectionTxt = `
        Section: ${section.name} (${section.shortName}) <br/>
        Signature: ${section.timeSignature} <br/>
        Tracks: <br/>
        `;

        for (const trackName in section.tracks) {
          const track = section.tracks[trackName];
          currentSectionTxt += `
          * [${trackName}] ${track} <br/>
          `;
        }
      }

      $("#current-section").html(currentSectionTxt);

      $("#play-button").prop('disabled', errorsFound)
    }
  }

  onPlayButton(e) {
    this.dispatchEvent(new Event('play'));
  }

  onCrewSelectorInput(e) {
    const newLocation = "/app/"
        + "?crew="
        + $("#crew-selector option:selected").val();

    window.location = newLocation;
  }

  onScoreSelectorInput(e) {
    this.dispatchEvent(new CustomEvent('load',
      {detail: {
        score: $("#score-selector option:selected").val()
      }}));
  }
}
