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
        var dropElement = getDropElement();
        my.catchDroppedFiles(dropElement, loadFile);
        /* uses ace editor in a second window. switching betweeen wysiwyg and source in ck causes multipl ace windows to open. . .
        if(dropElement.tagName.toLowerCase() !== 'div') {
            var textarea = dropElement;
            console.log(dropElement);
            var win = window.open('http://localhost:7777/ace editor.html');
            var blks = function (win) {
                if(win.ui) {
                    win.ui.session.setMode('ace/mode/html');
                    textarea.addEventListener('input', function () {
                        win.ui.session.setValue(my.editor.getData());
                    });
                    win.ui.editor.container.addEventListener('input', function () {
                        my.editor.setData(win.ui.session.getValue());
                    });
                } else {
                    setTimeout(blks, 250, win);
                }
            };
            setTimeout(blks, 0, win);
        }
        */
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
