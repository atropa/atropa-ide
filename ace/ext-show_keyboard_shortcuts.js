/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2013 Matthew Christopher Kastor-Inare III, Atropa Inc. Intl
 * All rights reserved.
 * 
 * Contributed to Ajax.org under the BSD license.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

ace.define('ace/ext/show_keyboard_shortcuts', ['require', 'exports', 'module' , 'ace/editor', 'ace/ext/menu_tools/overlay_page', 'ace/ext/menu_tools/get_editor_keyboard_shortcuts'], function(require, exports, module) {
    
    var Editor = require("ace/editor").Editor;
    function showKeyboardShortcuts (editor) {
        if(!document.getElementById('kbshortcutmenu')) {
            var overlayPage = require('./menu_tools/overlay_page').overlayPage;
            var getEditorKeybordShortcuts = require('./menu_tools/get_editor_keyboard_shortcuts').getEditorKeybordShortcuts;
            var kb = getEditorKeybordShortcuts(editor);
            var el = document.createElement('div');
            var commands = kb.reduce(function (previous, current) {
                return previous + '<div><b>' + current.command + '</b> : ' +
                current.key + '</div>';
            }, '');
            
            el.id = 'kbshortcutmenu';
            el.innerHTML = '<h1>Keyboard Shortcuts</h1>' + commands + '</div>';
            el.style.cssText = 'margin:0; padding:0;';
            overlayPage(editor, el, '0', '0', '0', null);
        }
    };
    module.exports.init = function (editor) {
        Editor.prototype.showKeyboardShortcuts = function () {
            showKeyboardShortcuts(this);
        };
        editor.commands.addCommands([{
            name: "showKeyboardShortcuts",
            bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
            exec: function(editor, line) {
                editor.showKeyboardShortcuts();
            }
        }]);
    };
    
});

ace.define('ace/ext/menu_tools/overlay_page', ['require', 'exports', 'module' ], function(require, exports, module) {
module.exports.overlayPage = function overlayPage (editor, contentElement, top, right, bottom, left) {
    top = (top) ? 'top: ' + top + ';' : '';
    bottom = (bottom) ? 'bottom: ' + bottom + ';' : '';
    right = (right) ? 'right: ' + right + ';' : '';
    left = (left) ? 'left: ' + left + ';' : '';
    
    var closer = document.createElement('div');
    var contentContainer = document.createElement('div');
    
    function documentEscListener (e) {
        if (e.keyCode === 27) {
            closer.click();
        }
    }
    
    closer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: fixed; top:0; bottom:0; left:0; right:0;' +
        'z-index: 9990; ' +
        'background-color: rgba(0, 0, 0, 0.2);';
    closer.addEventListener('click', function () {
        document.removeEventListener('keydown', documentEscListener);
        closer.parentNode.removeChild(closer);
        editor.focus();
        closer = null;
    });
    document.addEventListener('keydown', documentEscListener);
    
    contentContainer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: absolute;' +
        top + right + bottom + left +
        'z-index: 9991; ' +
        'box-shadow: rgba(126, 126, 126, 0.25) -20px 10px 25px; ' +
        'background-color: rgba(255, 255, 255, 0.6);' +
        'color: black; overflow: auto;';
    contentContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });
    
    contentContainer.appendChild(contentElement);
    closer.appendChild(contentContainer);
    document.body.appendChild(closer);
    editor.blur();
};

});
 
ace.define('ace/ext/menu_tools/get_editor_keyboard_shortcuts', ['require', 'exports', 'module' ], function(require, exports, module) {
module.exports.getEditorKeybordShortcuts = function getEditorKeybordShortcuts (editor) {
    var commands = editor.commands.byName;
    var commandName;
    var key;
    var platform = editor.commands.platform;
    var kb = [];
    for (commandName in commands) {
        try {
            key = commands[commandName].bindKey[platform];
            if (key) {
               kb.push({
                    'command' : commandName,
                    'key' : key
               });
            }
        } catch (e) {
        }
    }
    return kb;
};

});