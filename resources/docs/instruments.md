# Batukeitor docs

## Instruments packs
`Batukeitor` can use a different set of instruments/track for each `crew`.

## The `default instruments pack`
The [default instrument pack](https://github.com/clvLabs/batukeitor-instruments) is available on github and included as `default` in the [batukeitor-demo](https://github.com/clvLabs/batukeitor-demo) repo.

It comes with 12+1 instruments/tracks (12 configurable + `MT`) (_Metrónomo_ is required), but it's not limited to that (see [expanding the pack](#expanding-the-pack)).

## Structure of an `instruments pack`
```
 default/
├──  instruments.yml
├──  img/
│  ├──  AG.png
│  ├── ...
│  └──  TB.png
└──  samples/
   ├──  AG_hi.mp3
   ├──  ...
   └──  TB_lo.mp3
```

### The `instruments.yml` file
This file contains de definitions of all instruments.

```yml
# Batukeitor instruments file
instruments:

  MT:
    name: "Metrónomo"
    samples:
      "X": "MT_hi.mp3"
      "-": "MT_lo.mp3"
      "1": "MT_hi.mp3"
      "2": "MT_lo.mp3"
      "3": "MT_lo.mp3"
      "4": "MT_lo.mp3"
      "5": "MT_lo.mp3"
      "6": "MT_lo.mp3"
      "7": "MT_lo.mp3"
      "8": "MT_lo.mp3"

  #(...more content...)

  TB:
    name: "Tamborim"
    samples:
      "X": "TB_hi.mp3"
      "-": "TB_lo.mp3"

  RP:
    name: "Repenique"
    samples:
      "X": "RP_Drumstick_Center.mp3"
      "x": "RP_Drumstick_Edge.mp3"
      "-": "RP_Open_palm.mp3"
      ".": "RP_Closed_palm.mp3"

  #(...more content...)

  S1:
    name: "Surdo 1ª"
    samples:
      "X": "S1_hi.mp3"
      "-": "S1_lo.mp3"
```

Each instrument is defined by an `instrument block`:
```yml
  RP:
    name: "Repenique"
    samples:
      "X": "RP_Drumstick_Center.mp3"
      "x": "RP_Drumstick_Edge.mp3"
      "-": "RP_Open_palm.mp3"
      ".": "RP_Closed_palm.mp3"
```

In this case, the instrument's `id` (identificator) is `RP`, its `name` is `Repenique` and it has different `samples` (notes):
* `X`: Drumstick on center (file: `RP_Drumstick_Center.mp3`)
* `x`: Drumstick on edge (file: `RP_Drumstick_Edge.mp3`)
* `-`: Open palm (file: `RP_Open_palm.mp3`)
* `.`: Closed palm (file: `RP_Closed_palm.mp3`)

These notes can be used later to write scores.

You can add as many `samples` as you want to each instrument... if you have a good collection of audio samples you can give your scores very detailed info about the sound you want to achieve in your compositions.

The instrument `identificators` can be changed, as long as you use the same in the `tracks` of your scores. The only exception is the `MT` (_Metrónomo_), wich is used in the code (if you want to change the code as well, then there's no exceptions!).

### The `img` folder
This folder should contain a `png` file for each instrument `id`.

### The `samples` folder
This folder should contain all audio files specified in the `samples` sections of the instruments.

Note: `mp3` and `wav` files are tested and working (maybe more formats work).

## Expanding the pack

### Adding samples to an existing instrument
To add a new sample:
* Copy the audio sample to the `samples` folder.
* Edit `instruments.yml`.
  * Find the `instrument` you want to add the sample to.
  * Add a new entry in its `samples` section.
    * The `id` you use will be the character to use in scores.
    * The file name must match the one of the new audio sample.
* Now you can start using the new `sample` for this `instrument`in your scores.

### Adding instruments
To add a new instrument:
* Copy the audio samples you have for that instrument to the `samples` folder.
* Add a `png` icon for the instrument in the `img` folder.
* Edit `instruments.yml`.
* Duplicate one of the existing instruments.
* Change its `id`, `name` and `samples`.

### Adding tracks
Sometimes you want to add an extra track for an instrument you already have (let's say you want to have 2 independent _Caixa_ tracks).

You can create a new `instrument` with a new `id` and `name`, but _recycling_ the instrument's `samples`:
```yml
instruments:

  #(...more content...)

  CX2:
    name: "Caixa 2"
    samples:
      "X": "CX_hi.mp3"
      "-": "CX_lo.mp3"
```

Also, you will have to duplicate `img/CX.png` as `img/CX2.png` (or provide a new icon named `img/CX2.png`).

## Creating new packs
You can create an entirely different instrument pack for each crew.

* Go to the `data/instruments` folder.
* Duplicate the `demo` folder with any (valid) name you wish.
* Edit the contents of the new folder.
* Use the new folder's name as `instrumentPack` in your [crew pack](crew-packs.md) index file.
