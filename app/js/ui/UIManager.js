
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
      $("#score-info").text("");
      $("#full-score-view").html(`Cannot load score<br/>${errorMsg}`);
      $("#score-current-section").text("");
      $("#score-next-section").text("");
      $("#sections-tab").html(`Cannot load score<br/>${errorMsg}`);
      $("#play-button").prop("disabled", true)
      return;
    }

    // Score -------------------------------------------------------
    var scoreInfo = "";
    scoreInfo += `${score.name}:`;
    scoreInfo += ` ${score.numBeats} beats`;
    scoreInfo += ` @${score.bpm}BPM`;
    scoreInfo += ` = --:--`;
    $("#score-info").text(scoreInfo);

    $("#full-score-view").html("");
    this.buildScoreUI().appendTo("#full-score-view");

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

  buildScoreUI() {
    const containerElm = $("<div>");

    this.score.scoreSections.forEach((section, index) => {
      const sectionWidth = (section.numSixteenths / this.score.numSixteenths) * 100;

      const sectionElm = $("<div>", {
        id: `full-score-view-section-${index}`,
        class: "full-score-view-section",
      });
      sectionElm.css("background-color", `#${section.color}`);
      sectionElm.css("width", `${sectionWidth}%`);

      sectionElm.appendTo(containerElm);
    });

    return containerElm;
  }

  buildSectionUI(sectionId) {
    const section = this.score.sections[sectionId];

    const sectionElm = $("#section-template").clone();
    const sectionElmId = `section-${sectionId}`;
    sectionElm.attr("id", sectionElmId);

    const sectionHeaderElm = sectionElm.find(`#section-header`);
    var txt = `${section.name} (${section.timeSignature.name}) * ${section.numBars}`;
    sectionHeaderElm.text(txt);
    sectionHeaderElm.css("background-color", `#${section.color}`);

    // Metronome track
    {
      const instrument = this.instrumentMgr.list["MT"];

      const rowDiv = $("<div>", {
        id: `section-${section.id}-metronome`,
        class: "section-instrument-row",
      });

      rowDiv.appendTo(sectionElm.find(`#section-instrument-list`));

      $("<img>",{
        id: "section-instrument-icon",
        src: instrument.iconURL,
        title: `[${instrument.id}] ${instrument.name}`,
      }).appendTo(rowDiv);

      const metronomeStr = section.getMetronomeDisplayStr();
      $("<div>", {
        class: "section-track-row",
      }).html(`<pre>${metronomeStr}</pre>`).appendTo(sectionElm.find(`#section-track-list`));

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
        id: "section-instrument-icon",
        src: instrument.iconURL,
        title: `[${instrument.id}] ${instrument.name}`,
      }).appendTo(rowDiv);


      this.buildTrackUI(section, track).appendTo(sectionElm.find(`#section-track-list`));
    }

    return sectionElm;
  }

  buildTrackUI(section, track) {
    const trackElm = $("<div>", {
      id: `section-${section.id}-track-${track.id}`,
      class: `section-track-row`,
    });

    for (var index=0; index < track.length; index++) {
      const sample = track.samples[index];
      var className = "section-track-sixteenth";

      if (section.timeSignature.isBarStart(index)) {
        className += " bar-start";
      } else if (section.timeSignature.isBeatStart(index)) {
        className += " beat-start";
      } else if (section.timeSignature.isEighthNoteStart(index)) {
        className += " eighth-note-start";
      }

      var sixteenWidth = 100 / track.length;

      // if (section.timeSignature.isCompound())
      //   sixteenWidth *= (1/1.5);

      const sixteenthElm = $("<div>", {
        id: `section-${section.id}-track-${track.id}-sixteenth-${index}`,
        class: className,
        style: `width: ${sixteenWidth}%`,
      });

      if (sample)
        sixteenthElm.text(sample.id);

      sixteenthElm.appendTo(trackElm);
    }

    return trackElm;
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

    $("#app-content").children().each( (i,obj) => {
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
