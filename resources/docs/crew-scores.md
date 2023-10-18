# Batukeitor docs

## Crew scores
Each [crew pack](crew-packs.md) contains its own set of `scores`.
```
 demo/
├──  index.yml
└──  scores/
   ├──  demo1.yml
   ├──  samba-reggae.yml
   └──  teoria.yml
```

## The `scores` folder
All [Batukeitor YAML scores](batukeitor-yaml-score.md) should be placed under this folder.

The name of the `yml` files must match the _short names_ used in the `scores` section of the `index.yml` file.
```yml
# Batukeitor crew file
name: Demo
scores:
  demo1: "Demo score"
  samba-reggae: "Samba Reggae"
  teoria: "Teoría"
```

### Add new scores
To create a new score:
* Add a score file inside the `scores` folder of the corresponding `crew`.
  ```
   demo/
  ├──  index.yml
  └──  scores/
    ├──  demo1.yml
    ├──  new-score.yml
    ├──  samba-reggae.yml
    └──  teoria.yml
  ```
* Update the corresponding `crews/xxx/index.yml` for the score to show in the interface combo.
  ```yml
  # Batukeitor crew file
  name: Demo
  scores:
    new-score: "My new score"
    demo1: "Demo score"
    samba-reggae: "Samba Reggae"
    teoria: "Teoría"
  ```
* Note that you can alter the ordering in which the scores are shown in the interface combo.

### Add subfolders to organize scores
You can use subfolders if you accumulate a lot of scores, or you just want to keep them organized:
```
 demo/
├──  index.yml
└──  scores/
    ├──  2021
    │   └──  demo1.yml
    ├──  2022
    │   └──  teoria.yml
    └──  2023
        ├──  new-score.yml
        └──  samba-reggae.yml
```

```yml
# Batukeitor crew file
name: Demo
scores:
  2023/new-score: "My new score"
  2021/demo1: "Demo score"
  2023/samba-reggae: "Samba Reggae"
  2022/teoria: "Teoría"
```
