# Batukeitor setup instructions

# Web setup

## Pre-requisites
* You must have somewhere to publish it (hosting).
* You must have some kind of web server running on it (be it WordPress or whatever).
* You must have `SSH` access to that server.
* Your server's `SSH` shell should have [git](https://git-scm.com/) installed.

... (otherwise check with your closest _IT friend_) or see the [Local setup](#local-setup) section at the end.


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
~/www/batukeitor/data/crews/batuqueiros/scores$ mv demo1.yml uphill-samba.yml
~/www/batukeitor/data/crews/batuqueiros/scores$ rm samba-reggae.yml teoria.yml
~/www/batukeitor/data/crews/batuqueiros/scores$
```

We won't change the contents of the score yet, but we can change the name that will be displayed in the user interface with a quick:
```bash
~/www/batukeitor/data/crews/batuqueiros/scores$ nano uphill-samba.yml
```

The contents of the file will be:
```yml
# Batukeitor score
name: Demo 1
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
name: Demo
scores:
  demo1: "Demo"
  samba-reggae: "Samba Reggae"
  teoria: "Teoría"
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

But if it works... you'll find you only have the `Demo` score (even if we renamed it as `Uphill samba`).

From this point on you'll need to be able to add new scores and edit the existing ones.

## Add new scores

To create a new score:
* Add a `yml` file inside the `scores` folder of the corresponding `crew`.
* Update the corresponding `crews/xxx/index.yml` for the score to show in the interface combo.

For more details on score format, see the [Demo crew README](https://github.com/clvLabs/batukeitor-crew-demo/tree/master/README.md).

## Customize instruments

If you are going to customize your instruments, you should remove the repo link (not really necessary):
```bash
~$ cd www/batukeitor/data/instruments
~www/batukeitor/data/instruments$ rm -rf .git
~www/batukeitor/data/instruments$
```

Please see the [instruments pack README](https://github.com/clvLabs/batukeitor-instruments/blob/master/README.md) for more details on instruments.

# Local setup

If you are going to write/edit scores, it's always better/faster to edit files locally, test them until you're happy with the changes and then upload the scores to your web host using `FTP`.

Or maybe you just want to play with it for a while and you don't have or don't want to use your web hosting... whatever.

To install the `Batukeitor` app and the `instruments` and `demo crew` packs, [git](https://git-scm.com/) will be the easiest choice, as you can follow the setup instructions in the [Web setup](#web-setup) section.

If you don't have (and don't want) `git` or the setup instructions in the [Web setup](#web-setup) section don't fit your operating system (maybe installing on Windows), you can download `zip` files of the repos from https://github.com/clvLabs and extracting them instead of cloning the repos...

To have a local web server to test the app locally, you either need:
* Using [Python](https://www.python.org/) - Here [a sample article](https://realpython.com/python-http-server/) explaining how to do it.
* [XAMPP](https://www.apachefriends.org/)
* [PHP](https://www.php.net/manual/en/features.commandline.webserver.php)
* ... or any other you may find looking for **_my_operating_system_ local web server** on your search engine of choice.

