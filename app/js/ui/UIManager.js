
export class UIManager extends EventTarget {
  constructor(crews) {
    super();
    this.crews = crews;
    this.score = undefined;
    this.instrumentMgr = undefined;
  }

  init(crewId) {
    $("#app").show();
    $("#play-button").prop("disabled", true)
    $("#play-button").on("click", this.onPlayButton.bind(this));
    $("#crew-selector").on("input", this.onCrewSelectorInput.bind(this));
    $("#score-selector").on("input", this.onScoreSelectorInput.bind(this));
    $("#tab-button-score").on("click", { tab: "score-tab"}, this.onTabSelected.bind(this));
    $("#tab-button-sections").on("click", { tab: "sections-tab"}, this.onTabSelected.bind(this));
    $("#tab-button-instruments").on("click", { tab: "instruments-tab"}, this.onTabSelected.bind(this));

    $("#tab-button-score").addClass("active");
    $(`#score-tab`).show();

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
    for (const _scoreId in crew.scores) {
      const _scoreName = crew.scores[_scoreId]

      $("#score-selector").append(
        $("<option>",{
          value: _scoreId,
          text: _scoreName,
        })
      );

    }

    this.onScoreSelectorInput();
  }

  setScore(score, errorMsg) {
    this.score = score;

    if (this.score == undefined) {
      $("#score-info").html(`Cannot load score<br/>${errorMsg}`);
      $("#score-current-section").text("");
      $("#score-next-section").text("");
      $("#sections-tab").html(`Cannot load score<br/>${errorMsg}`);
      $("#play-button").prop("disabled", true)
      return;
    }

    // Score -------------------------------------------------------
    var scoreInfoTxt = "<pre>";

    var song = "";
    for (const i in this.score.song) {
      const sectionId = this.score.song[i];
      const section = this.score.sections[sectionId];
      if (section == null) {
        song += sectionId;
      } else {
        song += `[${section.shortName}]`;
      }
    }

    scoreInfoTxt += `${song}`;
    scoreInfoTxt += `\n\nBPM: ${this.score.bpm}`;
    scoreInfoTxt += "</pre>";

    $("#score-info").html(scoreInfoTxt);

    // Sections -------------------------------------------------------
    $("#sections-tab").html("");

    if (this.score.sections == null) {
      $("#sections-tab").text(`[ERROR] Score has no sections`);
      $("#play-button").prop("disabled", true)
      return;
    }

    for (const sectionId in this.score.sections) {
      this.buildSectionUI(sectionId).appendTo("#sections-tab");
    }

    const firstSectionId = Object.keys(this.score.sections)[0];
    const secondSectionId = Object.keys(this.score.sections)[1];

    $("#score-current-section").html("");
    this.buildSectionUI(firstSectionId).appendTo("#score-current-section");

    $("#score-next-section").html("");
    this.buildSectionUI(secondSectionId).appendTo("#score-next-section");


    $("#play-button").prop("disabled", false)
  }

  buildSectionUI(sectionId) {
    const section = this.score.sections[sectionId];

    const sectionElm = $("#section-template").clone();
    const sectionElmId = `section-${sectionId}`;
    sectionElm.attr("id", sectionElmId);
    sectionElm.css("background-color", `#${section.color}`);

    var txt = `${section.name} (${section.timeSignature.name})`;
    sectionElm.find(`#section-header`).text(txt);

    // Metronome track
    {
      const instrument = this.instrumentMgr.list["MT"];

      const rowDiv = $("<div>", {
        class: "section-instrument-row",
      });

      rowDiv.appendTo(sectionElm.find(`#section-instrument-list`));

      $("<img>",{
        src: instrument.iconURL,
        id: "section-instrument-icon",
        title: `[${instrument.id}] ${instrument.name}`,
      }).appendTo(rowDiv);

      const metronomeStr = section.getMetronomeDisplayStr();
      $("<div>", {
        class: "section-score-row",
      }).html(`<pre>${metronomeStr}</pre>`).appendTo(sectionElm.find(`#section-score`));

    }

    // Score tracks
    for (const trackId in section.tracks) {
      const instrument = this.instrumentMgr.list[trackId];
      const track = section.tracks[trackId];

      const rowDiv = $("<div>", {
        class: "section-instrument-row",
      });

      rowDiv.appendTo(sectionElm.find(`#section-instrument-list`));

      $("<img>",{
        src: instrument.iconURL,
        id: "section-instrument-icon",
        title: `[${instrument.id}] ${instrument.name}`,
      }).appendTo(rowDiv);


      $("<div>", {
        class: "section-score-row",
      }).html(`<pre>${track.notesStr}</pre>`).appendTo(sectionElm.find(`#section-score`));
    }

    return sectionElm;
  }

  setInstrumentManager(instrumentMgr, errorMsg) {
    this.instrumentMgr = instrumentMgr;
    var errorsFound = false;

    if (instrumentMgr == undefined) {
      errorsFound = true;
      $("#instruments-tab").html(`Cannot load instruments<br/>${errorMsg}`);
    } else {

      for (const instrumentId in instrumentMgr.list) {
        const instrument = instrumentMgr.list[instrumentId];

        const instrumentElm = $("#instrument-template").clone();
        const instrumentElmId = `instrument-${instrumentId}`;
        instrumentElm.attr("id", instrumentElmId);
        instrumentElm.appendTo("#instruments-tab");
        $(`#${instrumentElmId} #instrument-id`).text(instrument.id);
        $(`#${instrumentElmId} #instrument-name`).text(instrument.name);
        $(`#${instrumentElmId} #instrument-icon`).attr("src", instrument.iconURL);

        for (const sampleId in instrument.samples) {
          const sampleFileName = instrument.samples[sampleId];
          const sampleElm = $(`#${instrumentElmId} #template-instrument-sample-play`).clone();
          const sampleElmId = `${instrumentElmId}-sample-${sampleId}`;
          sampleElm.text(sampleId);
          sampleElm.attr("id", sampleElmId);
          sampleElm.appendTo(`#${instrumentElmId}`);
          sampleElm.on("click", { instrumentId: instrumentId, sampleId: sampleId}, this.onInstrumentSamplePlay.bind(this));
        }
      }
    }
  }

  onPlayButton(e) {
    this.dispatchEvent(new Event("play"));
  }

  onCrewSelectorInput(e) {
    const newLocation = "/app/"
        + "?crew="
        + $("#crew-selector option:selected").val();

    window.location = newLocation;
  }

  onScoreSelectorInput(e) {
    this.dispatchEvent(new CustomEvent("load",
      {detail: {
        scoreId: $("#score-selector option:selected").val()
      }}));
  }

  _getScoreURL(crewId, scoreId) {
    return `/data/crews/${crewId}/scores/${scoreId}.yml`;
  }

  onTabSelected(e) {
    $("#main-tab-buttons").children().each( (i,obj) => {
      if (obj == e.target) {
        $(obj).addClass("active");
      } else {
        $(obj).removeClass("active");
      }
    });

    $("#main-tab-container").children().each( (i,obj) => {
      if (obj.id == e.data.tab) {
        $(`#${obj.id}`).show();
      } else {
        $(`#${obj.id}`).hide();
      }
    });
  }

  onInstrumentSamplePlay(e) {
    this.dispatchEvent(new CustomEvent("playSample",
      {detail: {
        instrumentId: e.data.instrumentId,
        sampleId: e.data.sampleId,
      }}));
  }


}
