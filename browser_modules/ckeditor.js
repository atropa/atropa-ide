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
    var highlighter = require('./ckeditor aceSourceView.js');
    var getCodeHighlighterDefault = function () {
        return {
            'highlighter' : {},
            'getValue' : function () {
                throw new Error('implement this on codeHighlighter ' +
                    'instantiation');
            },
            'setValue' : function () {
                throw new Error('implement this on codeHighlighter ' +
                    'instantiation');
            }
        };
    };
    
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
    
    function highlighterSetup(textarea) {
        function l (e) {
            textarea.value = my.codeHighlighter.getValue();
        }
        my.editor.on('mode', function (e) {
            my.editor.removeListener('beforeCommandExec', l);
        });
        my.editor.on('beforeCommandExec', l);
        my.codeHighlighter.setValue(textarea.value);
    }
        
    function sourceViewOverride() {
        var frame;
        var textarea = my.getSourceEditorTextarea();
        textarea.style.cssText = textarea.style.cssText + ';display:none;';
        
        my.codeHighlighter.frame = document.createElement('iframe');
        my.codeHighlighter.frame.setAttribute('src', highlighter.url);
        my.codeHighlighter.frame.setAttribute('style', 
            'padding: 0; margin: 0; border: none; ' +
            'height: 100%; width: 100%; overflow: auto;'
        );
        
        textarea.parentNode.appendChild(my.codeHighlighter.frame);
        
        function waitForHighlighter() {
            try {
                my.codeHighlighter = highlighter.hook(my.codeHighlighter);
                highlighterSetup(textarea);
            } catch (e) {
                setTimeout(waitForHighlighter, 250);
            }
        }
        waitForHighlighter();
    }
    
    function modeSwitch () {
        if(my.editor.mode === 'wysiwyg') {
            var dropElement = getDropElement();
            my.catchDroppedFiles(dropElement, loadFile);
        }
        if(my.editor.mode === 'source') {
            //ace editor catches files.
            sourceViewOverride();
        }
    }
    
    this.getSourceEditorTextarea = function () {
        return document.getElementsByClassName('cke_source')[0];
    };
    
    this.setEditorValue = function (value) {
        my.editor.setData(value);
        modeSwitch();
    };
    
    this.codeHighlighter = getCodeHighlighterDefault();
    
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
