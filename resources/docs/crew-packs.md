# Batukeitor docs

## Crew packs
`Batukeitor` can manage as many `crews` (bands/ensembles) as you want/need.

A [demo/template crew pack](https://github.com/clvLabs/batukeitor-crew-demo) is available on github and included by default in the [batukeitor-demo](https://github.com/clvLabs/batukeitor-demo) repo.


It can be used as a template to add new crews to your instance of `Batukeitor`.

## Structure of a `crew pack`
```
 demo/
├──  index.yml
└──  scores/
    ├──  samba-reggae.yml
    ├──  sample.yml
    └──  theory.yml
```

### The `index.yml` file
```yml
# Batukeitor crew file
name: Demo crew
scores:
  sample: "Sample score"
  samba-reggae: "Samba Reggae"
  theory: "Basic Theory"
```

* The `name` field should be filled with the crew name.
* The `scores` list should contain, for each score we want published:
  * Its filename (without the `.yml` extension).
  * A description string (score _display name_).

Given the example above, score:
* `scores/sample` will be published as `Demo score`.
* `scores/samba-reggae.yml` will be published as `Samba Reggae`.
* `scores/theory.yml` will be published as `Basic Theory`.

### The `scores` folder
All score `yml` files should be placed under this folder.

See [crew scores](crew-scores.md) for details.
