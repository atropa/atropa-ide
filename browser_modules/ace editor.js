/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    ace,
    module,
    require,
    getComputedStyle
*/
module.exports = require('./editor.js');

module.exports.prototype.initializeAce = function (options) {
    "use strict";
    options = options || {};
    var my = this;
    var defaults = require('./ace editor default settings.js');
    
    function loadFile (files) {
        my.loadFile(files);
    }
    
    function initializeEditor () {
        
        function mergeGivenOptionsWithDefaults () {
            var out = defaults;
            Object.keys(defaults).forEach(function (esr) {
                Object.keys(defaults[esr]).forEach(function (setting) {
                    if(options[setting]) {
                        switch (typeof defaults[esr][setting]) {
                            case 'boolean' :
                                out[esr][setting] = (options[setting] === 'false') ? false : true ;
                                break;
                            case 'number' :
                                out[esr][setting] = Number(options[setting]);
                                break;
                            case 'string' :
                                out[esr][setting] = String(options[setting]);
                                break;
                            default:
                                break;
                        }
                    } else {
                        out[esr][setting] = defaults[esr][setting];
                    }
                });
            });
            return out;
        }
        
        function setEditorSettings () {
            var options = mergeGivenOptionsWithDefaults();
            Object.keys(options).forEach(function (esr) {
                Object.keys(options[esr]).forEach(function (fn) {
                    my[esr][fn](options[esr][fn]);
                });
            });
        }
        
        
        my.textarea = document.getElementById('newFile');
        my.editor = ace.edit("editor");
        my.session = my.editor.getSession();
        my.renderer = my.editor.renderer;
        my.editor.commands.addCommand({
            name: "save",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            exec: function() {
                my.save();
            }
        });
        my.session.setWrapLimit = function (limit) {
            my.session.setWrapLimitRange(limit - 20, limit);
        };
        setEditorSettings();
    }
    
    this.save = function () {
        var code = my.session.getValue();
        my.textarea.textContent = code;
        document.forms[0].submit();
    };
    
    this.setEditorValue = function (value) {
        my.session.setValue(value);
    };
    
    this.getEditorValue = function () {
        return my.session.getValue();
    };
    
    this.formatJs = function () {
        var formatter = require('atropa-jsformatter');
        my.setEditorValue(formatter(my.getEditorValue()));
    };
    
    this.catchDroppedFiles(document.getElementById('editor'), loadFile);
    
    initializeEditor();
};


