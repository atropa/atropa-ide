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
var fs, path;

fs = require('fs');
path = require('path');

function route(handle, parsedUrl, response, request) {
    
    var locationIsModule = false;
    var locationIsFile = false;
    var locationIsDirectory = false;
    var location = path.normalize(process.env.serverroot + '/' + parsedUrl.pathname);
    
	if (fs.existsSync(location)) {
        if(fs.statSync(location).isFile()) {
            if(/\.jsn$/.test(location)) {
                locationIsModule = true;
            } else {
                locationIsFile = true;
            }
        }
        if(fs.statSync(location).isDirectory()) {
            locationIsDirectory = true;
        }
    }
    
    if(locationIsModule) {
        handle.mod(response, request, location);
    } else if(locationIsFile) {
        handle.file(response, request, location);
    } else if(locationIsDirectory) {
		handle.dir(response, request, location);
	} else {
		console.log('No request handler found for ' + parsedUrl.pathname);
		response.writeHead(404, {'Content-Type' : 'text/plain'});
		response.write('404 Not found');
		response.end();
	}
}

exports.route = route;