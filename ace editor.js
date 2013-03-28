/*jslint
    indent: 4,
    maxerr: 50,
    vars: true,
    white: true,
    browser: true
*/
/*global
    require
*/
var ui;
window.addEventListener('load', function () {
    "use strict";
    var Ui = require('./browser_modules/ace editor.js');
    var req;
    var options;
    
    function getOptions () {
        var url = require('url');
        var loc = String(document.location.href);
        loc = loc.replace(/\?&/g, '?');
        loc = loc.replace(/(&#|&$)/g, '#');
        return url.parse(loc, true).query;
    }
    
    function loadAce (sample) {
        if(sample) {
            sample = String(sample).replace(/</g, '&lt;');
            document.getElementById('editor').innerHTML = sample;
        }
        ui = new Ui();
        ui.initializeAce(options);
    }
    
    options = getOptions();
    
    if(options.loadFile) {
        req = new XMLHttpRequest();
        
        req.onload = function reqListener () {
            document.title = decodeURIComponent(options.loadFile);
            loadAce(this.responseText);
        };
        req.open(
            "get",
            "getFileContents.jsn?fileLocation=" + options.loadFile,
            true
        );
        req.send(null);
    } else {
        loadAce();
        ui.formatJs();
    }
});