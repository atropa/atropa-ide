/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*globals
    module
*/
module.exports = {
    'url' : 'ace editor.html?mode=ace/mode/html',
    'hook' : function (codeHighlighter) {
        "use strict";
        codeHighlighter.getValue = function () {
            return codeHighlighter.frame.contentWindow.ui.session.getValue();
        };
        codeHighlighter.setValue = function (val) {
            return codeHighlighter.frame.contentWindow.ui.session.setValue(val);
        };
        return codeHighlighter;
    }
};


