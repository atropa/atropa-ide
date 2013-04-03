# atropa-ide

An ide for web development using ckeditor and ace.

## Installation

This project depends on node. If you don't have node you can find it at [http://nodejs.org](http://nodejs.org).

Once node is installed on your system you can get this module through npm
```text
npm install atropa-ide
```

## Usage


### Startup
atropa-ide may be started from the command line. Go into the `.bin` folder 
inside the node_modules folder where you installed this package and run 
`atropa-ide 5555`. The server will start and give you the web address to 
the main page. In this case it will be `http://localhost:5555` Use whatever 
port you want to when starting the server or leave it unspecified and a default
port will be chosen.

The atropa-ide may also be launched from scripts.

```javascript
var ide = require('atropa-ide');
var path = require('path');
var port = 9777;
var serverRoot = path.resolve('./node_modules/atropa-ide/');
// the port and serverRoot arguments are optional.
ide.start(port, serverRoot);
console.log('open http://localhost:' +
    port + ' in your web browser to get started.');
```
### Load Files by Dragging and Dropping

Both the ckeditor and ace editor support loading files by dropping them into 
the editable area. They also support saving the edited content to local 
files. Click on the save button and your browser should give you the option to 
save the file to disk.

### Options

#### Ace

##### Config

All options may be configured through the settings menu in the editor. 
The default settings are restored when the page is reloaded. To automatically 
set settings on page load, specify the setting in the query string of the url. 
For example to set the mode, theme, font size, and show invisibles on page 
load do
```text
http://localhost:5555/ace editor?setMode=ace/mode/html&setTheme=ace/theme/github&setFontSize=24px&setShowInvisibles=true
```

All supported options are the same as their names in the settings menu. For 
items set with checkboxes, give their values as either true or false. To set 
the mode, find the name of the mode you like in the dropdown box and prefix it 
with `ace/mode/` in the url. See the example above which sets the mode to 
`html` and the theme to `github`.

##### Autoload From Files or URLs

To automatically load a file into the editor on page load set the loadFile 
parameter of the query string to the path of the file you want loaded.
```text
http://localhost:5555/ace editor?loadFile=C:\Users\kastor\Desktop\aFile.html
```
```text
http://localhost:5555/ace editor?loadFile=http://www.google.com/
```

