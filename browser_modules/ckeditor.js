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
    
    function aceSetup(textarea, ace) {
        ace.session.on('change', function (e) {
            textarea.value = ace.session.getValue();
        });
        ace.session.setValue(textarea.value);
    }
        
    function sourceViewOverride() {
        var textarea = my.getSourceEditorTextarea();
        textarea.style.cssText = textarea.style.cssText + ';display:none;';
        
        var ace = document.createElement('iframe');
        ace.setAttribute('src', 'ace editor.html?mode=ace/mode/html');
        ace.setAttribute('style', 
            'padding: 0; margin: 0; border: none; ' +
            'height: 100%; width: 100%; overflow: auto;'
        );
        
        textarea.parentNode.appendChild(ace);
        
        function waitForAce() {
            try {
                aceSetup(textarea, ace.contentWindow.ui);
            } catch (e) {
                console.log('waiting for 250');
                setTimeout(waitForAce, 250);
            }
        }
        waitForAce();
    }
    /* I don't know if I'll use this or not. it works well enough but I'm going to try and get away with reusing ace editor.html
    function sourceViewOverride() {
        var textarea = my.getSourceEditorTextarea();
        textarea.style.cssText = textarea.style.cssText + ';display:none;';
        
        var tx = document.createElement('div');
        tx.id = 'editor';
        tx.style.cssText = 'width:100%;height:100%;';
        textarea.parentNode.appendChild(tx);
        var Highlighter = require('./ace editor.js');
        var highlight = new Highlighter();
        highlight.initializeAce();
        highlight.session.setMode("ace/mode/html");
        highlight.session.on('change', function (e) {
            textarea.value = highlight.session.getValue();
        });
        highlight.session.setValue(textarea.value);
    }
    */
    
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
