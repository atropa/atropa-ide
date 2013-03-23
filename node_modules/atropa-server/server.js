/*jslint
    indent: 4,
    maxerr: 100,
    node: true,
    sloppy: true,
    white: true,
    stupid: true,
    nomen: true,
    vars: true
*/

var http = require("http"),
    url = require('url');

function start(route, handle, port) {
    function onRequest(request, response) {
        var parsedUrl = url.parse(request.url, true);
        parsedUrl.pathname = decodeURIComponent(parsedUrl.pathname);
        route(handle, parsedUrl, response, request);
    }
    
    http.createServer(onRequest).listen(port);
    console.log('Server Started on port ' + port);
    console.log('Press ctrl+c to quit.');
}

exports.start = start;
