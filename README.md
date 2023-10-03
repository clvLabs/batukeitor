# Batukeitor

_Non-musician-friendly_ score reader/player web app for batucada ensembles.

![screenshot](/resources/img/screenshot.png "Title")

## Requirements
This is all static content, you just need a web server :)

## Setup
Once you have this repo downloaded in the public folder of your web server, go to the `data` folder and follow the instructions in its `README`.

When finished, the structure of the `data` folder should look something like this:
```
data/
├── crews/
│  ├── crew1/
│  │  ├── scores/
│  │  │  ├── score1.yml
│  │  │  └── score1.yml
│  │  └── index.yml
│  ├── crew2/
│  │  ├── scores/
│  │  │  ├── score1.yml
│  │  │  └── score1.yml
│  │  └── index.yml
│  ├── index.sample.yml
│  ├── index.yml
│  └── README.md
├── instruments/
│  ├── img/
│  │  ├── xx.png
│  │  ├── yy.png
│  │  └── zz.png
│  ├── samples/
│  │  ├── xx.mp3
│  │  ├── yy.mp3
│  │  └── zz.mp3
│  └── instruments.yml
```
