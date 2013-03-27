var ide = require('./atropa-ide.js');
var port = process.argv[2] || 9777;
ide.start(port);
console.log('open http://localhost:' +
    port + ' in your web browser to get started.');


