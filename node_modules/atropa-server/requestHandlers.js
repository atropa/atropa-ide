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

var fs = require('fs');
var path = require('path');
var querystring = require('querystring');
var url = require('url');
var mime = require('mime');
var mustache = require('mustache');

mime.define({
    'application/javascript': ['jsn'],
    'text/plain': ['ini', 'url']
});

function dirList (location) {
    var template = fs.readFileSync(
        path.normalize(__dirname + '/autoindex/autoindex.mustache'),
        'utf8'
    );
    
    var sortablejsPath = '/' + path.relative(
        process.env.serverroot,
        __dirname + '/autoindex/sorttable.js'
    ).replace(/\\/g, '/');
    
    var view = {};
    
    view.title = (
        '/' + path.relative(process.env.serverroot, location) + '/'
    ).replace(/\\/g, '/').replace(/\/{2,}/g, '/');
    
    view.scripts = [
        {'src' : sortablejsPath}
    ];
    view.rows = fs.readdirSync(location).map(function (listing) {
        
        var out = fs.statSync(path.normalize(location + '/' + listing));
        out.link = '';
        out.link = listing;
        
        if(out.isFile()) {
            out.mimeType = mime.lookup(listing);
        }
        
        if(out.isDirectory()) {
            out.link += '/';
        }
        ['ctime', 'mtime', 'atime'].forEach(function (item) {
            var d = out[item];
            out[item] = d.getFullYear() +
                '/' + ('0' + (d.getMonth() + 1)).slice(-2) +
                '/' + ('0' + d.getDate()).slice(-2) +
                ' ' +
                ('0' + d.getHours()).slice(-2) +
                ':' + ('0' + d.getMinutes()).slice(-2) +
                ':' + ('0' + d.getSeconds()).slice(-2)
            ;
        });
        return out;
    });
    
    return mustache.render(template, view);
}

function autoindex (response, request, location) {
    response.writeHead(200, {
        'Content-Type' : 'text/html'
    });
    response.write(dirList(location));
    response.end();
}

function redirect (response, request, toLocation) {
    console.log('redirecting to ' + toLocation);
    response.writeHead(301, {
        'Location' : toLocation.replace(/\/\//g, '/')
    });
    response.end();
}

function dir(response, request, location) {
    var lastCharIsSlash = location.charAt(location.length - 1);
    lastCharIsSlash = (lastCharIsSlash === '/' || lastCharIsSlash === '\\');
    
    if(lastCharIsSlash === false) {
        // redirect if directory location is missing trailing slash
        redirect(
            response,
            request,
            decodeURIComponent(url.parse(request.url).pathname) + '/'
        );
    } else if (fs.existsSync(path.normalize(location + '/index.html'))) {
        // redirect to index if it exists
        redirect(
            response,
            request,
            decodeURIComponent(url.parse(request.url).pathname) + '/index.html'
        );
    } else {
        // show directory listing
        autoindex(response, request, location);
    }
}

function respondWithFileContents(response, path, contentType) {
    if(contentType) {
        contentType = {'Content-Type' : contentType};
    } else {
        contentType = {'Content-Type' : mime.lookup(path)};
    }
	fs.readFile(path, 'binary', function (error, file) {
		if (error) {
			response.writeHead(500, {
				'Content-Type' : 'text/plain'
			});
			response.write(error + '\n');
			response.end();
		} else {
			response.writeHead(200, contentType);
			response.write(file, 'binary');
			response.end();
		}
	});
}

function file (response, request, fileLocation) {
    respondWithFileContents(response, fileLocation);
}

function mod(response, request, fileLocation) {
    var req = require(fileLocation);
    req(response, request);
}

exports.file = file;
exports.dir = dir;
exports.mod = mod;