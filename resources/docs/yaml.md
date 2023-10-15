# Batukeitor docs

## The `YAML` file format
All editable files in `Batukeitor` use the [YAML](https://en.wikipedia.org/wiki/YAML) specification. If you are planning on creating your own scores, a quick _self-training session_ on YAML is highly recommended. (Note: YouTube can get you there quicker than Google sometimes).

You can edit these `YAML` files with your regular _Note Pad_ (even with _Word_!), but it's always recommended to use a more _serious_ text editor for working with text files, some options being:
* [VS Code](https://code.visualstudio.com) or its free/libre version [VSCodium](https://vscodium.com).
* [Notepad++](https://notepad-plus-plus.org).
* [Sublime Text](https://www.sublimetext.com).

## TLDR - I want a quick explanation
Some highlights about the format:
* Any line starting with `#` is interpreted as a comment (ignored).
* Data elements are grouped, grouping is defined by indentation (number of spaces preceding the first word in the line).

This is how a `score` file named `my-new-song.yml` could look like:
```yml
# Batukeitor score
name: My new song

bpm: 110
score:
  intro
  ---
  end

sections:

  intro:
    name: Intro
    color: "#c3a012"
    tracks:
      #   "1---2---3---4---1---2---3---4---"
      S3: "X   X   X  X  X X     X XXXXXXXX"
      S2: "X   X   X  X  X X     X         "
      S1: "X   X   X  X  X X     X         "

  end:
    name: End
    color: "#006000"
    tracks:
      #   "1---2---3---4---"
      S3: "X               "
      S2: "X               "
      S1: "X               "

```

* The first line is a comment (`# Batukeitor score`).
* `name: My new song` defines the `name` _property_ of the score file.
* `bpm: 110` defines the `bpm` _property_ of the score file.
* The next _property_ (`score`) has been written in separate lines for easier reading:
  ```yml
  score:
    intro
    ---
    end
  ```
* It could also be written in a more _compact_ way:
  ```yml
  score: intro end
  ```
* The `sections:` _property_ is a list of items, so all contained `sections` will be indented (spaces will be added at the start of the line).
  * `intro:` is one of the items in the `sections` list. It has a few _internal properties_ which are indented to indicate they belong to `intro`.
    * `name: Intro` defines the `name` _property_ of the `intro` item in the `sections` list.
    * `color: "#c3a012"` defines its `color` _property_.
    * `tracks:"` is a list of `track` items contained in the `intro` section.
      * The first line in each `track` is a comment.
      * Each following line defines a _property_ identifying the instrument name and samples to be played.
  * `end:` is another one of the items in the `sections` list, with the same _internal format_ as `intro`

This allows creating nested data structures that can help representing things such as musical scores :)
