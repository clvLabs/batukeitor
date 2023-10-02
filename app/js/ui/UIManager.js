
export class UIManager extends EventTarget {
  constructor(crews) {
    super();
    this.crews = crews;
    this.score = undefined;
    this.instrumentMgr = undefined;
    this.PLAYER_BEAT_WIDTH_PIXELS = 100;
    this.FULL_MODULE_16THS = (4*4*2);    // 2 full 4/4 bars
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

    for (const _crewId in this.crews.all()) {
      crew = this.crews.get(_crewId);

      $("#crew-selector").append(
        $("<option>",{
          value: _crewId,
          text: crew.name,
          selected: (_crewId == crewId),
        })
      );
    }

    crew = this.crews.get(crewId);
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
      $("#instruments-tab-content").html(`Cannot load instruments<br/>${errorMsg}`);
      return;
    }

    $("#instruments-tab-content").html("");
    for (const instrumentId in instrumentMgr.all()) {
      this._buildInstrumentUI(instrumentId).appendTo("#instruments-tab-content");
    }

    // Mute metronome at startup
    this._muteInstrument(this.instrumentMgr.get("MT"), true);
  }

  setAudioManagerPlaying(playing) {
    if (playing) {
      // Nothing so far
    } else {
      $(`.play-button`).each((index, item) => {
        $(item).removeClass("disabled");
        $(item).removeClass("active");
    });
    $(`.play-button-icon`).each((index, item) => {
      $(item).attr("src", "/app/img/play-icon.svg");
  });

    }
  }

  setScoreError(errorMsg) {
    this.score = undefined;
    $("#score-info").text("");
    $("#score-minimap").html("");
    $("#score-tab-content").html(`Cannot load score<br/>${errorMsg}`);
    $("#sections-tab-content").html(`Cannot load score<br/>${errorMsg}`);
  }

  setScore(score) {
    this.score = score;

    this._updateScoreInfo();

    // Score -------------------------------------------------------
    $("#score-minimap").html("");
    this._buildScoreMiniMap().appendTo("#score-minimap");

    // Sections -------------------------------------------------------
    $("#sections-tab-content").html("");

    if (this.score.sections == null) {
      $("#sections-tab-content").text(`[ERROR] Score has no sections`);
      return;
    }

    for (const sectionId in this.score.sections) {
      this._buildSectionUI("section-", sectionId).appendTo("#sections-tab-content");
    }

    const scoreTabContentElm = $("#score-tab-content");
    scoreTabContentElm.html("");

    const instrumentsContainerElm = $("<div>", {
      id: "score-instruments-container",
    });
    instrumentsContainerElm.appendTo(scoreTabContentElm);

    const sectionHeaderElm = $("<div>", {
      id: `score-instruments-container-header`,
    });
    sectionHeaderElm.appendTo(instrumentsContainerElm);

    this._buildTrackInstrumentsUI("score", this.instrumentMgr.all(), true).appendTo(instrumentsContainerElm);

    const scrollingContainerElm = $("<div>", {
      id: "score-scrolling-container",
    });
    scrollingContainerElm.appendTo(scoreTabContentElm);

    const scrollingContentElm = $("<div>", {
      id: "score-scrolling-content",
    });
    scrollingContentElm.appendTo(scrollingContainerElm);

    var scoreWidth = this.score.numBeats * this.PLAYER_BEAT_WIDTH_PIXELS;
    scoreWidth *= 1.008; // Add some pixels for borders
    scrollingContentElm.css("width", `${scoreWidth}px`);

    this.score.scoreSections.forEach((section, index) => {
      this._buildSectionUI(`score-section-${index}-`, section.id, false).appendTo(scrollingContentElm);
    });

    // Update muted instruments
    Object.values(this.instrumentMgr.all()).forEach(instrument => {
      this._updateInstrumentMute(instrument);
    });

  }

  _updateScoreInfo() {
    var scoreInfo = "";
    scoreInfo += `${this.score.name}:`;
    scoreInfo += ` ${this.score.numBeats} beats`;
    scoreInfo += ` @${this.score.bpm}BPM`;
    scoreInfo += ` = ${this.score.getDurationStr()}`;
    $("#score-info").text(scoreInfo);
  }

  _buildInstrumentUI(instrumentId) {
    const instrument = this.instrumentMgr.get(instrumentId);

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
      src: instrument.iconURL,
    });
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

  _buildScoreMiniMap() {
    const containerElm = $("<div>");

    this.score.scoreSections.forEach((section, index) => {
      const sectionWidth = (section.numBeats / this.score.numBeats) * 100;

      const sectionElm = $("<div>", {
        id: `score-minimap-section-${index}`,
        class: "score-minimap-section",
      });
      sectionElm.css("background-color", `#${section.color}`);
      sectionElm.css("width", `${sectionWidth}%`);

      sectionElm.appendTo(containerElm);
    });

    return containerElm;
  }

  _buildSectionUI(idPrefix, sectionId, fullModule=true) {
    const section = this.score.sections[sectionId];
    const sectionElmId = `${idPrefix}${sectionId}`;

    const sectionElm = $("<div>", {
      id: sectionElmId,
      class: fullModule ? "section-block-full" : "section-block-simple",
    });

    // Header container
    const sectionHeaderContainerElm = $("<div>", {
      id: `${sectionElmId}-header-container`,
      class: "section-header-container",
    });
    sectionHeaderContainerElm.appendTo(sectionElm);

    if (fullModule) {
      const playHeaderElm = $("<div>", {
        class: "header-play-button",
      });
      playHeaderElm.appendTo(sectionHeaderContainerElm);

      const playButtonElm = $("<button>", {
        id: `${sectionElmId}-play-button`,
        class: "play-button",
      });
      playButtonElm.on("click", {section: section}, this._onSectionPlayButton.bind(this));
      playButtonElm.appendTo(playHeaderElm);

      const playIconElm = $("<img>", {
        id: `${sectionElmId}-play-button-icon`,
        src: "/app/img/play-icon.svg",
        class: "play-button-icon",
      });
      playIconElm.appendTo(playButtonElm);
    }

    // Header
    const sectionHeaderElm = $("<div>", {
      id: `${sectionElmId}-header`,
      class: "section-header",
    });

    if (!fullModule) {
      const sectionWidth = this.PLAYER_BEAT_WIDTH_PIXELS * (section.numBeats);
      sectionHeaderElm.css("width", `${sectionWidth}px`);
    }

    var headerTxt = "";
    if (fullModule) {
      headerTxt += `${section.name}`;
      headerTxt += ` (${section.timeSignature.name}`;
      if (section.numBars > 1) {
        headerTxt += ` ${section.numBars}B`;
      }
      headerTxt += `)`;
    } else {
      headerTxt = section.name;
    }
    sectionHeaderElm.text(`${headerTxt}`);
    sectionHeaderElm.css("background-color", `#${section.color}`);
    this._adjustTextColor(sectionHeaderElm);
    sectionHeaderElm.appendTo(sectionHeaderContainerElm);

    // Contents
    const sectionContentElm = $("<div>", {
      id: `${sectionElmId}-content`,
      class: "section-content",
    });
    sectionContentElm.appendTo(sectionElm);

    // Instrument list
    if (fullModule) {
      this._buildTrackInstrumentsUI(`section-${section.id}`, section.tracks).appendTo(sectionContentElm);
    }

    // Track list
    const sectionTracksElm = $("<div>", {
      id: `${sectionElmId}-track-list`,
      class: "section-track-list",
    });
    sectionTracksElm.appendTo(sectionContentElm);

    Object.values(section.tracks).forEach(track => {
      this._buildTrackUI(sectionElmId, section, track, fullModule).appendTo(sectionTracksElm);
    });

    return sectionElm;
  }

  _buildTrackInstrumentsUI(idPrefix, tracks, addScorePlayButton=false) {
    const sectionInstrumentsElm = $("<div>", {
      id: `${idPrefix}-instrument-list`,
      class: "section-instrument-list",
    });

    if (addScorePlayButton) {
      const playHeaderElm = $("<div>", {
        class: "header-play-button",
      });
      playHeaderElm.appendTo(sectionInstrumentsElm);

      const playButtonElm = $("<button>", {
        id: `${idPrefix}-play-button`,
        class: "play-button",
      });
      playButtonElm.on("click", this._onScorePlayButton.bind(this));
      playButtonElm.appendTo(playHeaderElm);

      const playIconElm = $("<img>", {
        id: `${idPrefix}-play-button-icon`,
        src: "/app/img/play-icon.svg",
        class: "play-button-icon",
      });
      playIconElm.appendTo(playButtonElm);
    }

    for (const trackId in tracks) {
      const instrument = this.instrumentMgr.get(trackId);

      const instrumentRowElm = $("<div>", {
        class: "section-instrument-row",
      });

      instrumentRowElm.appendTo(sectionInstrumentsElm);

      const instrumentIconElm = $("<img>",{
        id: `${idPrefix}-instrument-${instrument.id}-icon`,
        class: `section-instrument-icon track-${instrument.id}-mute`,
        src: instrument.iconURL,
        title: `[${instrument.id}] ${instrument.name}`,
      });
      instrumentIconElm.on("click", {instrument: instrument}, this._onTrackInstrumentClick.bind(this));
      instrumentIconElm.appendTo(instrumentRowElm);

    }
    return sectionInstrumentsElm;
  }

  _buildTrackUI(sectionElmId, section, track, fullModule=true) {
    const trackElm = $("<div>", {
      id: `${sectionElmId}-track-${track.id}`,
      class: `section-track-row  track-${track.id}-mute`,
    });

    for (var index=0; index < track.length; index++) {
      const sample = track.samples[index];
      var className = "section-track-16th";

      if (section.timeSignature.isBarStart(index)) {
        className += " bar-start";
      } else if (section.timeSignature.isBeatStart(index)) {
        className += " beat-start";
      } else if (section.timeSignature.isEighthNoteStart(index)) {
        className += " eighth-note-start";
      }

      if (fullModule) {
        // var note16thWidth = 100 / track.length;
        var note16thWidth = 100 / this.FULL_MODULE_16THS;

        if (section.timeSignature.isCompound())
          note16thWidth *= (1/1.5);
      } else {
        var note16thWidth = 100 / track.length;
      }

      const note16thElm = $("<div>", {
        id: `${sectionElmId}-track-${track.id}-16th-${index}`,
        class: className,
        style: `width: ${note16thWidth}%`,
      });

      if (sample)
        note16thElm.text(sample.id);

      note16thElm.appendTo(trackElm);
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

  _onTrackInstrumentClick(e) {
    const instrument = e.data.instrument;
    var mute = true;

    if ($(e.target).hasClass("muted"))
      mute = false;

    this._muteInstrument(instrument, mute);
  }

  _muteInstrument(instrument, mute) {
    instrument.muted = mute;
    this._updateInstrumentMute(instrument);
  }

  _updateInstrumentMute(instrument) {
    $(`.track-${instrument.id}-mute`).each((index, item) => {
      if (instrument.muted)
        $(item).addClass("muted");
      else
        $(item).removeClass("muted");
    });
  }

  _onInstrumentSamplePlay(e) {
    this.dispatchEvent(new CustomEvent("playSample",
      {detail: {
        instrumentId: e.data.instrumentId,
        sampleId: e.data.sampleId,
      }}
    ));
  }

  _updatePlayButtons(playButton, playIcon) {
    if (playButton.hasClass("active")) {
      // It's active -> Go to stopped mode
      $(`.play-button`).each((index, item) => {
        $(item).removeClass("disabled");
      });

      playButton.removeClass("active");
      playIcon.attr("src", "/app/img/play-icon.svg");
    } else {
      // It's inactive -> Go to playing mode
      $(`.play-button`).each((index, item) => {
        $(item).addClass("disabled");
      });

      playButton.removeClass("disabled");
      playButton.addClass("active");
      playIcon.attr("src", "/app/img/stop-icon.svg");
    }
  }

  _onScorePlayButton(e) {
    const playButton = $("#score-play-button");
    const playIcon = $("#score-play-button-icon");

    if (playButton.hasClass("active")) {
      this.dispatchEvent(new Event("stop"));
    } else {
      this.dispatchEvent(new CustomEvent("play",
      {detail: {
        type: "score",
        score: this.score,
      }}));
    }

    this._updatePlayButtons(playButton, playIcon);
  }

  _onSectionPlayButton(e) {
    const section = e.data.section;
    const playButton = $(`#section-${section.id}-play-button`);
    const playIcon = $(`#section-${section.id}-play-button-icon`);

    if (playButton.hasClass("active")) {
      this.dispatchEvent(new Event("stop"));
    } else {
      this.dispatchEvent(new CustomEvent("play",
      {detail: {
        type: "section",
        score: this.score,
        section: section,
      }}));
    }

    this._updatePlayButtons(playButton, playIcon);
  }

  // From: https://www.jqueryscript.net/text/reverse-text-background-color.html
  _adjustTextColor(DOMElem) {
    var backgroundColor = DOMElem.css("background-color");
    backgroundColor =  backgroundColor.split(',');
    const R = parseInt(backgroundColor[0].split('(')[1]);
    const G = parseInt(backgroundColor[1]);
    const B = parseInt(backgroundColor[2].split(')')[0]);
    const rPrime = R/255;
    const gPrime = G/255;
    const bPrime = B/255;
    const cMax = Math.max(rPrime, gPrime, bPrime);
    const cMin = Math.min(rPrime, gPrime, bPrime);
    var lightness = (cMax + cMin)/2;
    lightness >= 0.40 ? DOMElem.css("color", "black") : DOMElem.css("color", "white");
  }

}
