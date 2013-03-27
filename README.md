# atropa-ide

An ide for web development using ckeditor and ace.

## installation

This project depends on node. If you don't have node you can find it at [http://nodejs.org](http://nodejs.org).

Once node is installed on your system you can get this module through npm
```
npm install atropa-ide
```

## usage

atropa-ide may be started from the command line. Go into the `.bin` folder 
inside the node_modules folder where you installed this package and run 
`atropa-ide 5555`. The server will start and give you the web address to 
the main page. In this case it will be `http://localhost:5555` Use whatever 
port you want to when starting the server or leave it unspecified and a default
port will be chosen.

To launch the atropa-ide from somewhere outside of the .bin directory 
you will need to give a second argument telling atropa-ide where the module 
folder is located. For example, to launch atropa-ide from the parent folder 
containing the node_modules directory run 
```
node_modules/.bin/atropa-ide 5555 ./node_modules/atropa-ide/
```
from the parent folder.

The atropa-ide may also be launched from scripts.

```
var ide = require('atropa-ide');
var path = require('path');
var port = 9777;
var serverRoot = path.resolve('./node_modules/atropa-ide/');
ide.start(port, serverRoot);
console.log('open http://localhost:' +
    port + ' in your web browser to get started.');
```