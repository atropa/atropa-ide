/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    CKEDITOR,
    module,
    require
*/
module.exports = require('./editor.js');

module.exports.prototype.initializeCk = function () {
    "use strict";
    var my = this;
    
    function getDropElement() {
        var dropElement;
        try {
            dropElement = my.editor.document.getDocumentElement().$;
        } catch (e) {
            dropElement = my.editor.container.$;
        }
        return dropElement;
    }
    
    function loadFile (files) {
        my.loadFile(files);
    }
    
    function modeSwitch () {
        my.catchDroppedFiles(getDropElement(), loadFile);
    }
    
    this.setEditorValue = function (value) {
        my.editor.setData(value);
        modeSwitch();
    };
    
    CKEDITOR.replace('newFile', {
        fullPage: true,
        extraPlugins: 'wysiwygarea',
        on: {            
            'instanceReady': function instanceReadyFn (evt) {
                my.editor = evt.editor;
                my.editor.execCommand('maximize');
                my.editor.on('mode', modeSwitch);
                modeSwitch();
            }
        }
    });
};
