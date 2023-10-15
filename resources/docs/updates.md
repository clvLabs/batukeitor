# Batukeitor docs

## Updates

### When installed from a `zip` file
If you installed your instance of `Batukeitor` using the `zip` file from the [demo/template repo](https://github.com/clvLabs/batukeitor-demo) and you only modified stuff from the `data/crews` folder:

* Make a backup of your `data/crews` folder.
* Download the latest `zip`.
* Delete everything in your published folder and extract the new `zip` in it.
* Replace the new `data/crews` folder with your backup.


### When installed with `git`
If you installed `Batukeitor` using `git` and at some point in the future you want to benefit from the latest changes, the procedure is quite simple:

Go to the folder where `Batukeitor` is installed and do a `git pull`... that's all!
```bash
~$ cd www/batukeitor
~/www/batukeitor$ git pull
remote: Counting objects: (n), done.
...
 (n) files changed, (n) insertions(+), (n) deletions(-)
 ~/www/batukeitor$
```

You can also update your instrument pack the same way:
```bash
~$ cd www/batukeitor/data/instruments
~/www/batukeitor/data/instruments$ git pull
remote: Counting objects: (n), done.
...
 (n) files changed, (n) insertions(+), (n) deletions(-)
 ~/www/batukeitor/data/instruments$
```
