/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/

ace.define('ace/ext/show_keyboard_shortcuts', ['require', 'exports', 'module' , 'ace/ext/overlay_page', 'ace/ext/get_editor_keyboard_shortcuts'], function(require, exports, module) {
    module.exports.showKeyboardShortcuts = function showKeyboardShortcuts (editor) {
        if(!document.getElementById('kbshortcutmenu')) {
            var overlayPage = require('./overlay_page').overlayPage;
            var getEditorKeybordShortcuts = require('./get_editor_keyboard_shortcuts').getEditorKeybordShortcuts;
            var kb = getEditorKeybordShortcuts(editor);
            var el = document.createElement('div');
            var commands = kb.reduce(function (previous, current) {
                return previous + '<div><b>' + current.command + '</b> : ' +
                current.key + '</div>';
            }, '');
            
            el.id = 'kbshortcutmenu';
            el.innerHTML = '<h1>Keyboard Shortcuts</h1>' + commands + '</div>';
            el.style.cssText = 'margin:0; padding:0;';
            overlayPage(el, '0', '0', '0', null);
        }
    };
});

ace.define('ace/ext/overlay_page', ['require', 'exports', 'module' ], function(require, exports, module) {
module.exports.overlayPage = function overlayPage (contentElement, top, right, bottom, left) {
    top = (top) ? 'top: ' + top + ';' : '';
    bottom = (bottom) ? 'bottom: ' + bottom + ';' : '';
    right = (right) ? 'right: ' + right + ';' : '';
    left = (left) ? 'left: ' + left + ';' : '';
    
    var closer = document.createElement('div');
    var contentContainer = document.createElement('div');
    
    closer.style.cssText = 'margin: 0; padding: 0; ' +
        'position: fixed; top:0; bottom:0; left:0; right:0;' +
        'z-index: 9990; ' +
        'background-color: rgba(0, 0, 0, 0.2);';
    closer.addEventListener('click', function () {
        closer.parentNode.removeChild(closer);
        closer = null;
    });
    
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
};

});
 
ace.define('ace/ext/get_editor_keyboard_shortcuts', ['require', 'exports', 'module' ], function(require, exports, module) {
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