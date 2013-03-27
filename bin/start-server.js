#!/usr/bin/env node
var path = require('path');
var ide = require('../atropa-ide.js');

var port = process.argv[2] || 9777;
var serverRoot = process.argv[3] || '../atropa-ide/';
serverRoot = path.resolve(serverRoot);
console.log('server root: ' + serverRoot);

ide.start(port, serverRoot);
console.log('open http://localhost:' +
    port + ' in your web browser to get started.');


