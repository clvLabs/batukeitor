# Batukeitor docs

## Batukeitor from scratch
More advanced users can benefit from the modular nature of the app and manage repos for instrument packs and crews in a more efficient way.

This install method also helps you understand the way `Batukeitor` works.

## Install the main app
Clone the `batukeitor` repo inside your exposed `www` folder (not necessarily in its root, it could be in a subfolder).
```bash
~$ cd www
~/www$ git clone https://github.com/clvLabs/batukeitor.git
Cloning into 'batukeitor'...
...
Resolving deltas: 100% (404/404), done.
~/www$
```

## Install the instruments pack
Enter the `batukeitor/data` folder and clone the `instruments` repo:
```bash
~/www$ cd batukeitor/data
~/www/batukeitor/data$ git clone https://github.com/clvLabs/batukeitor-instruments.git instruments
Cloning into 'instruments'...
...
Receiving objects: 100% (47/47), 355.47 KiB | 2.32 MiB/s, done.
~/www/batukeitor/data$
```

## Create crews (as many as needed)

### Clone the demo crews repo
Enter the `crews` folder and clone the `demo` repo for your own crew (I'll use `Batuqueiros` as an example crew name):
```bash
~/www/batukeitor/data$ cd crews
~/www/batukeitor/data/crews$ git clone https://github.com/clvLabs/batukeitor-crew-demo.git batuqueiros
Cloning into 'batuqueiros'...
...
Resolving deltas: 100% (5/5), done.
~/www/batukeitor/data/crews$
```

Because you will be using this crew only as a template, you can remove the repo link:
```bash
~/www/batukeitor/data/crews$ rm -rf batuqueiros/.git
~/www/batukeitor/data/crews$
```

### Keep a single score from the template
Now we'll keep one of the demo scores to modify it and delete the rest. We'll name the new score `Uphill Samba`:
```bash
~/www/batukeitor/data/crews$ cd batuqueiros/scores/
~/www/batukeitor/data/crews/batuqueiros/scores$ mv sample.yml uphill-samba.yml
~/www/batukeitor/data/crews/batuqueiros/scores$ rm samba-reggae.yml theory.yml
~/www/batukeitor/data/crews/batuqueiros/scores$
```

We won't change the contents of the score yet, but we can change the name that will be displayed in the user interface with a quick:
```bash
~/www/batukeitor/data/crews/batuqueiros/scores$ nano uphill-samba.yml
```

The contents of the file will be:
```yml
# Batukeitor score
name: Sample score
...
```

In this case, we would only change the `name` field:
```yml
# Batukeitor score
name: Uphill samba
...
```

### Update the new crew's info file
Now you should edit the new crew index file:
```bash
~/www/batukeitor/data/crews/batuqueiros/scores$ cd ..
~/www/batukeitor/data/crews/batuqueiros$ nano index.yml
```

The initial contents of the file will be:
```yml
# Batukeitor crew file
name: Demo crew
scores:
  sample: "Sample score"
  samba-reggae: "Samba Reggae"
  theory: "Basic Theory"
```

In this case, we would edit the file to be like follows:
```yml
# Batukeitor crew file
name: Batuqueiros
scores:
  uphill-samba: "Uphill samba"
```

You can repeat these steps as many times as crews you'll manage. For this example, I'll assume I cloned the `crews` repo again for the `Bambas do Surdo` crew.

It's a personal preference of mine, but I recommend keeping folder names in lower case.

## Update the main crew index
Now, we'll prepare the main crew index file (the one used for the crew selection combo in the user interface):
```bash
~/www/batukeitor/data/crews$ cp index.sample.yml index.yml
~/www/batukeitor/data/crews$ nano index.yml
```

The initial contents of the file will be:
```yml
# Batukeitor crews
#
# Once a crew repo is cloned here,
#  add its folder name to the "crews" list:
#

crews:
  #- sample-crew-1
  #- sample-crew-2

# defaultCrew: sample-crew-1
```

In this case, we would edit the file to be like follows:
```yml
# Batukeitor crews
crews:
  - batuqueiros
  - bambasdosurdo

defaultCrew: batuqueiros
```

Keep in mind that this `data/crews/index.yml` has to be updated every time you want to add/remove/rename a crew, besides managing the corresponding data folders.

You can temporarily disable an entire crew by marking its line as a comment (with the `#` character):
```yml
# Batukeitor crews
crews:
  - batuqueiros
#  - bambasdosurdo

defaultCrew: batuqueiros
```

## Test the app
Congratulations! Now you have `Batukeitor` up and running.

Use your browser of choice to check if everything is working as it should. In this example, assuming my website is `somesambaschool.com`, I would visit `https:/somesambaschool.com/batukeitor`.

If you find any problems, try using your browser's dev tools to see if you can find any clues.

But if it works... you'll find you only have the `Sample` score (even if we renamed it as `Uphill samba`).

From this point on you'll need to be able to add new scores and edit the existing ones, you will find help in the [docs](README.md).
