/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    vars: true,
    node: true
*/

module.exports = function (options) {
    "use strict";
    options = options || {};
    if(Array.isArray(options.files) === false) {
        throw new Error('files array must be specified');
    }
    
    var browserify = require('browserify');
    
    var defaults = {
        'files' : options.files || null, //Array
        'add' : options.add || null, // string
        'require' : options.require || null, // array
        'external' : options.external || null, // array
        'ignore' : options.ignore || null, // array
        'transform' : options.transform || null, // string or function
        'insertGlobals' : options.insertGlobals || false, // boolean
        'detectGlobals' : options.detectGlobals || true, // boolean
        'debug' : options.debug || false, // boolean
        'callback' : options.callback || function (src) {
            console.log(src);
        }
    };
    
    [
        'add',
        'require',
        'external',
        'ignore',
        'transform',
        'insertGlobals',
        'detectGlobals',
        'debug',
        'callback'
    ].forEach(function (item) {
        if(defaults[item] === null) {
            delete defaults[item];
        }
    });
    
    var b = browserify(defaults.files);
    
    [
        'add',
        'transform'
    ].forEach(function (fn) {
        if(defaults[fn]) {
            if(typeof defaults[fn] === 'string') {
                b[fn](defaults[fn]);
            }
        }
    });
    
    [
        'require',
        'external',
        'ignore'
    ].forEach(function (fn) {
        if(Array.isArray(defaults[fn])) {
            defaults[fn].forEach(function (file) {
                b[fn](file);
            });
        }
    });
    
    b.bundle({
        'insertGlobals' : defaults.insertGlobals,
        'detectGlobals' : defaults.detectGlobals,
        'debug' : defaults.debug
    }, defaults.callback);
};


