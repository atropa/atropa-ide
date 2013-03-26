"use strict";

/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    module,
    require
*/
var compile = require('./browserifyWrapper.js');
var fs = require('fs');
var path = require('path');

module.exports.getCompilerOptions = function getCompilerOptions () {
    "use strict";
    var compilerOptions = {
        'files' : (
            fs.readdirSync(
                path.normalize(__dirname + '/../browser_modules')
            ).map(
                function (item) {
                    return './browser_modules/' + item;
                }
            ).filter(
                function (item) {
                    return fs.statSync(item).isFile();
                }
            )
        ),
        'require' : [],
    };
    compilerOptions.require = compilerOptions.files;
    compilerOptions.require.push('url');
    compilerOptions.require.push('atropa-jsformatter');
    
    return compilerOptions;
};

module.exports.writeToFile = function writeToFile (filename) {
    var compilerOptions = this.getCompilerOptions();
    var formatter;
    compilerOptions.callback = function (err, src) {
        var fs = require('fs');
        if(err) {
            throw new Error('Could not write compiled files to file');
        } else {
            formatter = require('atropa-jsformatter');
            src = formatter(src);
            fs.writeFileSync(filename, src, 'utf8');
        }
    }
    compile(compilerOptions);
};

module.exports.serverResponse = function serverResponse (response, request) {
    var compilerOptions = this.getCompilerOptions();
    compilerOptions.callback = function (err, src) {
        if(err) {
            err = String(err);
            response.writeHead(500, {'Content-Type' : 'text/plain'});
            response.write(err, 'utf8');
        } else {
            response.writeHead(200, {'Content-Type' : 'text/javascript'});
            response.write(src, 'utf8');
        }
        response.end();
    }
    compile(compilerOptions);
};