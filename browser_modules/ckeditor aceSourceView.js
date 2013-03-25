module.exports = {
    'url' : 'ace editor.html?mode=ace/mode/html',
    'hook' : function (codeHighlighter) {
        codeHighlighter.getValue = function () {
            return codeHighlighter.frame.contentWindow.ui.session.getValue();
        };
        codeHighlighter.setValue = function (val) {
            return codeHighlighter.frame.contentWindow.ui.session.setValue(val);
        };
        return codeHighlighter;
    }
}


