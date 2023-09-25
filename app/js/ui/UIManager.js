
export class UIManager extends EventTarget {
  constructor(crews) {
    super();
    this.crews = crews;
    this.score = undefined;
    this.instruments = undefined;
  }

  init(crewId) {
    $("#app").show();
    $(`#app-logo`).attr("src", "img/batukeitor-logo.svg");
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

    if (score == undefined) {
      $("#score-info").html(`Cannot load score<br/>${errorMsg}`);
      $("#score-current-section").text("");
      $("#score-next-section").text("");
      $("#sections-tab").html(`Cannot load score<br/>${errorMsg}`);
      $("#play-button").prop("disabled", true)
      return;
    }

    // Score -------------------------------------------------------
    var scoreInfoTxt = "<pre>";

    for (const sectionId in score.sections) {
      const section = score.sections[sectionId];
      scoreInfoTxt += `[${section.shortName}: ${section.name}]`;
    }

    var song = "";
    for (const i in score.song) {
      const sectionId = score.song[i];
      const section = score.sections[sectionId];
      if (section == null) {
        song += sectionId;
      } else {
        song += `[${section.shortName}]`;
      }
    }

    scoreInfoTxt += `\n\n${song}`;
    scoreInfoTxt += `\n\nBPM: ${score.bpm}`;
    scoreInfoTxt += "</pre>";

    $("#score-info").html(scoreInfoTxt);

    // Sections -------------------------------------------------------
    $("#sections-tab").html("");

    if (score.sections == null) {
      $("#sections-tab").text(`[ERROR] Score has no sections`);
      $("#play-button").prop("disabled", true)
      return;
    }

    for (const sectionId in score.sections) {
      const section = score.sections[sectionId];
      const sectionElm = $("<div>", {
            id: `section-${sectionId}`,
            class: "score-section",
        });
        sectionElm.css("background-color", `#${section.color}`);
        sectionElm.appendTo("#sections-tab");
        sectionElm.html(this.getSectionText(section));
    }

    const firstSection = this.score.sections[Object.keys(this.score.sections)[0]];
    const secondSection = this.score.sections[Object.keys(this.score.sections)[1]];
    $("#score-current-section").html(this.getSectionText(firstSection));
    $("#score-current-section").css("background-color", firstSection.color);
    $("#score-next-section").html(this.getSectionText(secondSection));
    $("#score-next-section").css("background-color", secondSection.color);

    $("#play-button").prop("disabled", false)
  }

  getSectionText(section) {
    var sectionTxt = "<pre>";
    sectionTxt += `---------------- ${section.name} `
    sectionTxt += `(${section.timeSignature}) \n\n`

    for (const trackName in section.tracks) {
      const track = section.tracks[trackName];
      sectionTxt += `[${trackName}] ${track}\n`;
    }

    sectionTxt += "</pre>";

    return sectionTxt;
  }

  setInstruments(instruments, errorMsg) {
    this.instruments = instruments;
    var errorsFound = false;

    if (instruments == undefined) {
      errorsFound = true;
      $("#instruments-tab").html(`Cannot load instruments<br/>${errorMsg}`);
    } else {

      for (const instrumentId in instruments.list) {
        const instrument = instruments.list[instrumentId];

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
    console.log(`[DBG] onInstrumentSamplePlay - ${e.data.instrumentId} ${e.data.sampleId}`);
  }


}
