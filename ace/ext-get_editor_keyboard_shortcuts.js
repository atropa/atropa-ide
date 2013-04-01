/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
 
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