# Batukeitor docs

## The `Batukeitor YAML` score format
`Batukeitor` scores are formatted as [YAML](yaml.md) text files for easy editing.

You can find score samples in the [scores folder of the demo crew repo](https://github.com/clvLabs/batukeitor-crew-demo/tree/master/scores).

### The file's header comments
```yml
# Batukeitor score
# Based on: https://www.youtube.com/watch?v=xQ6Lr1CqbfU
```
Comments can be used in the file header to add information about the score.

### The `name` field
```yml
name: Sample score
```
The _display name_ of the score, used in the user interface.

### The `bpm` field
```yml
bpm: 110
```
The initial/recommended `BPM` for the score.

### The `score` field
```yml
score:
  intro
  ---
  b1 b1 b1 v1
  b1 b1 b1 v3
  ---
  b2 b2 b2 v2
  b2 b2 b2 v3
  ---
  end
```
The sequence of `sections` used to build the full score:
* Each `section` is identified by its `id` (See [Single section structure](#single-section-structure)).
* Sections can be grouped to help with bar counts, etc.
* Groups can be visually separated with `---` (does not affect playback).

### The `sections` field
```yml
sections:

  intro:
    # (...section contents...)

  b1:
    # (...section contents...)

  #(...more sections...)
```
The list of available `sections` in the score.

Each `section` is identified by its `id` (`intro`/`b1` in this example) and contains details in its _inner fields_.

### Single `section` structure
```yml
  b1:
    name: Base 1
    color: "#006000"
    timeSignature: 4/4
    tracks:
      #   "1---2---3---4---"
      DD: "                "
      AP: "                "
      CH: "X--XX--XX--XX--X"
      AG: "                "
      CC: "X --X --X --X - "
      CV: "                "
      TB: "    X  X X  X  X"
      RP: "    X  X X  X  X"
      CX: "----X--X-X--X--X"
      S3: "X     X       X "
      S2: "X  X  X   X     "
      S1: "X  X  X   X     "
```

* The `id` (_identificator_) of this section is `b1`.
  * This is the section name used to build the `score` field.
  * It's a _short version_ of the _display_ name meant to keep the `score` readable.
  * It can have no spaces or start with symbols.
  * It can not be repeated amongst sections.
* Each `section` has some _inner fields_:
  * `name` with its _display name_.
  * `color` with its _display color_. A default color pallette will be used when not provided.
  * `timeSignature` with its time signature (See [Time signatures](#time-signatures)).
  * `tracks` with the list of tracks (See [Tracks](#tracks)).

### Tracks
* A comment line is used to help putting notes in place.
  ```yml
        #   "1---2---3---4---"
  ```
* Each `track` is identified by its `instrument id` (Please see the [instruments docs](instruments.md) for more details on instruments).
  ```yml
      S1: "X  X  X   X     "
  ```
* Each character (symbol) in a `track` represents an eighth note.
  * Where a space is found, no sound will be played.
  * Where a character is found, the corresponding `sample` for its `instrument` will be played.
* Multiple bars can be joined, as in following example:
  ```yml
    longintro:
      name: Long Intro
      color: "#c3a012"
      tracks:
        #   "1---2---3---4---1---2---3---4---1---2---3---4---1---2---3---4---1---2---3---4---1---2---3---4---1---2---3---4---"
        DD: "                                                                                                                "
        AP: "                                                                                                                "
        CH: "                                X --X --X --X --X --X --X --X --X --X --X --X --X --X --X --X --X --X --X --X --"
        AG: "X - X - X- -X - X - X - X- -X - X - X - X- -X - X - X - X- -X - X - X - X- -X - X - X - X- -X - X - X - X- -X - "
        CC: "                                 X  X X  X  X X  X  X X  X  X X  X  X X  X  X X  X  X X  X  X X  X  X X  X  X X "
        CV: "                                                                                                                "
        TB: "                                                                                                                "
        RP: "                                                                                                X X X X  X X XXX"
        CX: "                                                                                                X X X X  X X XXX"
        S3: "                                                                                                X X X X  X X XXX"
        S2: "                                                                                                X X X X  X X XXX"
        S1: "                                                                                                X X X X  X X XXX"
  ```

### Time signatures
```yml
  b1:
    name: Base 1
    color: "#006000"
    timeSignature: 4/4
    tracks:
      # ...
```

`Batukeitor` uses time signatures:
* In the user interface:
  * To highlight the first beat in a bar.
  * To highlight the first 8th of the rest of beats in each bar.
* In the audio engine:
  * To calculate the time used for each 8th note.

Allowed values for time signatures:
  * `2/4`
  * `3/4`
  * `4/4`
  * `6/8`
  * `9/8`
  * `12/8`

If a `section` does not specify `timeSignature`, `4/4` will be assumed.
```yml
  b1:
    name: Base 1
    color: "#006000"
    tracks:
      # ...
```

### Relationship between spaces and beats/bars
|Signature|Guide line|Spaces per beat|Spaces per bar|
|-|-|-|-|
|2/4|"1---2---"|4|8|
|3/4|"1---2---3---"|4|12|
|4/4|"1---2---3---4---"|4|16|
|6/8|"1-----2-----"|6|12|
|9/8|"1-----2-----3-----"|6|18|
|12/8|"1-----2-----3-----4-----"|6|24|

## Tips'n'tricks

#### Those color numbers are too weird
```yml
  b1:
    name: Base 1
    color: "#006000"
```
_What is that #006000_?

If you [google "color 006000"](https://www.google.com/search?q=color+006000) you get a nice display of the color represented by _that weird number_, and also a tool you can use to get more _color numbers_.

#### Sometimes I get lost counting 8ths while composing
In this case it's useful to duplicate the _guide comment line_ for each `track`. You can leave the comment lines there, they are ignored. But I personally prefer to clean after writing so the `score` looks nice even in the `yml` format.
```yml
  b68x2:
    name: Base 6/8 (2bars)
    color: "#9d09ff"
    timeSignature: 6/8
    tracks:
      #   "1-----2-----1-----2-----"
      DD: "                        "
      #   "1-----2-----1-----2-----"
      AP: "                        "
      #   "1-----2-----1-----2-----"
      CH: "X     X     X     X     "
      #   "1-----2-----1-----2-----"
      AG: "                        "
      #   "1-----2-----1-----2-----"
      CC: "  X X   X X   X X   X X "
      #   "1-----2-----1-----2-----"
      CV: "                        "
      #   "1-----2-----1-----2-----"
      TB: "X     X     X     X     "
      #   "1-----2-----1-----2-----"
      RP: "X     X     X     X     "
      #   "1-----2-----1-----2-----"
      CX: "X - - X - - X - - X - - "
      #   "1-----2-----1-----2-----"
      S3: "X     X     X     X     "
      #   "1-----2-----1-----2-----"
      S2: "X     X     X     X     "
      #   "1-----2-----1-----2-----"
      S1: "X     X     X     X     "
```

