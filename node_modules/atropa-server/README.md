A simple http server for node with autoindexing and lazy module loading.

This is a rough draft, really rough. I believe I've got autoindexing
working properly. I've also put in some redirection logic so that the current
URL will always end with either a file name or trailing slash. This is to ensure
that relative links will work in the autoindex pages.

Files with a `jsn` extension will be treated as JavaScript Node files and will 
be processed server side. `jsn` files are to be written as modules exporting a
single function which takes the response and request objects and handles them.

The web root is the folder containing your node_modules folder. This server
automatically finds index.html if given a directory. This server uses the [mime
module](https://npmjs.org/package/mime) to automatically serve files with the 
proper content type. See the documentation on the mime module for instructions 
on adding custom mime types.

# Basic Usage

Set up a node project with the simplest structure possible:

```
myProjectFolder
  |
  |___node_modules
  |       |
  |       |___atropa_server
  |
  |___index.html
  |
  |___server.js
  |
  |___serverSideJavaScript.jsn
```

Then in index.html put whatever html content you want.

In server.js do:
```
var atropaServer = require('atropa-server');
// starting the server on port 9999
// an optional second parameter for setting the server root
// as an absolute path may be specified. The server root 
// defaults to `path.dirname(process.mainModule.filename)`
atropaServer.start(9999);
```

In serverSideJavaScript.jsn do:
```
module.exports = function (response, request) {
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.write('hello', 'utf8');
    response.end();
};

```

After that run `node server.js` and open a web browser to 
`http://localhost:9999` and whatever content you've put into index.html will 
magically appear! Navigate to `http://localhost:9999/serverSideJavaScript.jsn`
and BANG! you'll see the wonderful wonderment of dynamically lazily loading your module. Go ahead and make all the `jsn` files you want and name them whatever
you want. They'll be cached the first time they're called so they don't cost
anything until they're needed and only cost something once! Of course any
changes to `jsn` files will require you to restart the server if the changed
file has been cached already.