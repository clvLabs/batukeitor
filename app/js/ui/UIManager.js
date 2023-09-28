
export class UIManager extends EventTarget {
  constructor(crews) {
    super();
    this.crews = crews;
    this.score = undefined;
    this.instrumentMgr = undefined;
  }

  init(crewId) {

    window.onscroll = () => {
      const header = $("#app-sticky-header");
      var winOfs = window.scrollY;
      var hdrOfs = header.offset().top;

      if (winOfs == hdrOfs) {
        if (winOfs <= 80) {
          if (header.hasClass("sticky"))
            header.removeClass("sticky");
        }
      } else if (winOfs > hdrOfs) {
        if (!header.hasClass("sticky"))
          header.addClass("sticky");
      } else {
        if (header.hasClass("sticky"))
          header.removeClass("sticky");
      }
    };


    $("#app").show();
    $("#crew-selector").on("input", this._onCrewSelectorInput.bind(this));
    $("#score-selector").on("input", this._onScoreSelectorInput.bind(this));
    $("#tab-button-score").on("click", { tab: "score-tab"}, this._onTabSelected.bind(this));
    $("#tab-button-sections").on("click", { tab: "sections-tab"}, this._onTabSelected.bind(this));
    $("#tab-button-instruments").on("click", { tab: "instruments-tab"}, this._onTabSelected.bind(this));

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

    this._onScoreSelectorInput();
  }

  setInstrumentManager(instrumentMgr, errorMsg) {
    this.instrumentMgr = instrumentMgr;
    var errorsFound = false;

    if (instrumentMgr == undefined) {
      errorsFound = true;
      $("#instruments-content").html(`Cannot load instruments<br/>${errorMsg}`);
      return;
    }

    $("#instruments-content").html("");
    for (const instrumentId in instrumentMgr.list) {
      this._buildInstrumentUI(instrumentId).appendTo("#instruments-content");
    }
  }

  setScore(score, errorMsg) {
    this.score = score;

    this._updateScoreInfo();

    if (this.score == undefined) {
      $("#full-score-view").html("");
      $("#score-content").html(`Cannot load score<br/>${errorMsg}`);
      $("#sections-content").html(`Cannot load score<br/>${errorMsg}`);
      return;
    }

    // Score -------------------------------------------------------
    $("#full-score-view").html("");
    this._buildScoreUI().appendTo("#full-score-view");

    // Sections -------------------------------------------------------
    $("#sections-content").html("");

    if (this.score.sections == null) {
      $("#sections-content").text(`[ERROR] Score has no sections`);
      return;
    }

    for (const sectionId in this.score.sections) {
      this._buildSectionUI(sectionId).appendTo("#sections-content");
    }

    $("#score-content").html("");
    this.score.scoreSections.forEach((section, index) => {
      this._buildSectionUI(section.id).appendTo("#score-content");
    });
  }

  _updateScoreInfo() {
    if (this.score == undefined) {
      $("#score-info").text("");
      return;
    }

    var scoreInfo = "";
    scoreInfo += `${this.score.name}:`;
    scoreInfo += ` ${this.score.numBeats} beats`;
    scoreInfo += ` @${this.score.bpm}BPM`;
    scoreInfo += ` = ${this.score.getDurationStr()}`;
    $("#score-info").text(scoreInfo);
  }

  _buildInstrumentUI(instrumentId) {
    const instrument = this.instrumentMgr.list[instrumentId];

    const instrumentElm = $("<div>", {
      id: `instrument-${instrument.id}-info`,
      class: "instrument-info",
    });

    // Id
    const instrumentIdElm = $("<span>", {
      id: `instrument-${instrument.id}-id`,
      class: "instrument-id",
    });
    instrumentIdElm.text(instrument.id);
    instrumentIdElm.appendTo(instrumentElm);

    // Icon
    const instrumentIconElm = $("<img>", {
      id: `instrument-${instrument.id}-icon`,
      class: "instrument-icon",
    });
    instrumentIconElm.attr("src", instrument.iconURL);
    instrumentIconElm.appendTo(instrumentElm);

    // Name
    const instrumentNameElm = $("<span>", {
      id: `instrument-${instrument.id}-name`,
      class: "instrument-name",
    });
    instrumentNameElm.text(instrument.name);
    instrumentNameElm.appendTo(instrumentElm);

    // Samples
    const instrumentSamplesElm = $("<div>", {
      id: `instrument-${instrument.id}-samples-container`,
      class: "instrument-samples-container",
    });
    instrumentSamplesElm.appendTo(instrumentElm);

    for (const sampleId in instrument.samples) {
      const sampleFileName = instrument.samples[sampleId];

      const sampleElm = $("<button>", {
        id: `instrument-${instrument.id}-sample-${sampleId}`,
        class: "instrument-sample",
      });
      sampleElm.text(sampleId);
      sampleElm.on("click", { instrumentId: instrumentId, sampleId: sampleId}, this._onInstrumentSamplePlay.bind(this));
      sampleElm.appendTo(instrumentSamplesElm);
    }

    return instrumentElm;
  }

  _buildScoreUI() {
    const containerElm = $("<div>");

    this.score.scoreSections.forEach((section, index) => {
      const sectionWidth = (section.numBeats / this.score.numBeats) * 100;

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

  _buildSectionUI(sectionId, withInstruments=true) {
    const section = this.score.sections[sectionId];

    const sectionElm = $("<div>", {
      id: `section-${sectionId}`,
      class: "section-block",
    });

    // Header
    const sectionHeaderElm = $("<div>", {
      id: `section-${sectionId}-header`,
      class: "section-header",
    });

    sectionHeaderElm.text(`${section.name} (${section.timeSignature.name})`);
    sectionHeaderElm.css("background-color", `#${section.color}`);
    sectionHeaderElm.appendTo(sectionElm);

    // Contents
    const sectionContentElm = $("<div>", {
      id: `section-${sectionId}-content`,
      class: "section-content",
    });
    sectionContentElm.appendTo(sectionElm);

    // Instrument list
    if (withInstruments) {
      const sectionInstrumentsElm = $("<div>", {
        id: `section-${sectionId}-instrument-list`,
        class: "section-instrument-list",
      });
      sectionInstrumentsElm.appendTo(sectionContentElm);

      for (const trackId in section.tracks) {
        const instrument = this.instrumentMgr.list[trackId];

        const instrumentRowElm = $("<div>", {
          class: "section-instrument-row",
        });

        instrumentRowElm.appendTo(sectionInstrumentsElm);

        $("<img>",{
          id: `section-${sectionId}-instrument-${instrument.id}-icon`,
          class: "section-instrument-icon",
          src: instrument.iconURL,
          title: `[${instrument.id}] ${instrument.name}`,
        }).appendTo(instrumentRowElm);

      }
    }

    // Track list
    const sectionTracksElm = $("<div>", {
      id: `section-${sectionId}-track-list`,
      class: "section-track-list",
    });
    sectionTracksElm.appendTo(sectionContentElm);

    Object.values(section.tracks).forEach(track => {
      this._buildTrackUI(section, track).appendTo(sectionTracksElm);
    });

    return sectionElm;
  }

  _buildTrackUI(section, track) {
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

      // var sixteenWidth = 100 / track.length;
      var sixteenWidth = 100 / (4*4*2);    // 2 full 4/4 bars

      if (section.timeSignature.isCompound())
        sixteenWidth *= (1/1.5);

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

  _onCrewSelectorInput(e) {
    const newLocation = "/"
        + "?crew="
        + $("#crew-selector option:selected").val();

    window.location = newLocation;
  }

  _onScoreSelectorInput(e) {
    this.dispatchEvent(new CustomEvent("load",
      {detail: {
        scoreId: $("#score-selector option:selected").val()
      }}));
  }

  _onTabSelected(e) {
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

  _onInstrumentSamplePlay(e) {
    this.dispatchEvent(new CustomEvent("playSample",
      {detail: {
        instrumentId: e.data.instrumentId,
        sampleId: e.data.sampleId,
      }}));

  }
}
