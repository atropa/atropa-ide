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

var server           = require('./server.js');
var router           = require('./router.js');
var requestHandlers  = require('./requestHandlers.js');
var path             = require('path');

function start (userPort, serverroot) {
    process.env.serverroot = serverroot || path.dirname(process.mainModule.filename);
    userPort = userPort || 8888;
    server.start(router.route, requestHandlers, userPort);
}

exports.start = start;
