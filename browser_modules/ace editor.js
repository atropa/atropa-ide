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
    require
*/
module.exports = require('./editor.js');

module.exports.prototype.initializeAce = function () {
    "use strict";
    var my = this;
    
    this.textarea = document.getElementById('newFile');
    this.editor = ace.edit("editor");
    this.session = this.editor.getSession();
    this.renderer = this.editor.renderer;
    
    this.editor.setTheme("ace/theme/twilight");
    this.editor.setShowFoldWidgets(true);
    this.editor.setScrollSpeed(true);
    this.editor.setDragDelay(150);
    this.editor.setSelectionStyle('line');
    this.editor.setHighlightActiveLine(true);
    this.editor.setHighlightSelectedWord(true);
    this.editor.setReadOnly(false);
    this.editor.setBehavioursEnabled(true);
    this.editor.setWrapBehavioursEnabled(true);
    this.editor.setShowFoldWidgets(true);
    
    this.session.setOverwrite(false);
    this.session.setMode("ace/mode/javascript");
    this.session.setUseWrapMode(true);
    this.session.setWrapLimit = function (limit) {
        my.session.setWrapLimitRange(limit, limit);
    };
    this.session.setWrapLimit(80);
    this.session.setUseSoftTabs(true);
    this.session.setTabSize(4);
    this.session.setOverwrite(false);
    this.session.setNewLineMode('windows');
    this.session.setUseWorker(true);
    this.session.setMode('ace/mode/javascript');
    this.session.setUseWrapMode(true);
    
    this.renderer.setAnimatedScroll(false);
    this.renderer.setShowInvisibles(false);
    this.renderer.setDisplayIndentGuides(true);
    this.renderer.setShowPrintMargin(true);
    this.renderer.setPrintMarginColumn(80);
    this.renderer.setShowGutter(true);
    this.renderer.setFadeFoldWidgets(false);
    this.renderer.setHighlightGutterLine(true);
    this.renderer.setHScrollBarAlwaysVisible(false);
    
    this.save = function () {
        var code = this.session.getValue();
        my.textarea.textContent = code;
        document.forms[0].submit();
    };
    
    this.editor.commands.addCommand({
        name: "save",
        bindKey: {win: "Ctrl-S", mac: "Command-S"},
        exec: function() {
            my.save();
        }
    });
    
    this.setEditorValue = function (value) {
        my.session.setValue(value);
    };
    
    function loadFile (files) {
        my.loadFile(files);
    }
    
    this.catchDroppedFiles(document.getElementById('editor'), loadFile);
    
    this.options = {
        "setNewLineMode" : [{
                "textContent" : "unix",
                "value" : "unix"
            }, {
                "textContent" : "windows",
                "value" : "windows"
            }, {
                "textContent" : "auto",
                "value" : "auto"
            }
        ],
        "setTheme" : [{
                "textContent" : "ambiance",
                "value" : "ace/theme/ambiance"
            }, {
                "textContent" : "chaos",
                "value" : "ace/theme/chaos"
            }, {
                "textContent" : "chrome",
                "value" : "ace/theme/chrome"
            }, {
                "textContent" : "clouds",
                "value" : "ace/theme/clouds"
            }, {
                "textContent" : "clouds_midnight",
                "value" : "ace/theme/clouds_midnight"
            }, {
                "textContent" : "cobalt",
                "value" : "ace/theme/cobalt"
            }, {
                "textContent" : "crimson_editor",
                "value" : "ace/theme/crimson_editor"
            }, {
                "textContent" : "dawn",
                "value" : "ace/theme/dawn"
            }, {
                "textContent" : "dreamweaver",
                "value" : "ace/theme/dreamweaver"
            }, {
                "textContent" : "eclipse",
                "value" : "ace/theme/eclipse"
            }, {
                "textContent" : "github",
                "value" : "ace/theme/github"
            }, {
                "textContent" : "idle_fingers",
                "value" : "ace/theme/idle_fingers"
            }, {
                "textContent" : "kr",
                "value" : "ace/theme/kr"
            }, {
                "textContent" : "merbivore",
                "value" : "ace/theme/merbivore"
            }, {
                "textContent" : "merbivore_soft",
                "value" : "ace/theme/merbivore_soft"
            }, {
                "textContent" : "monokai",
                "value" : "ace/theme/monokai"
            }, {
                "textContent" : "mono_industrial",
                "value" : "ace/theme/mono_industrial"
            }, {
                "textContent" : "pastel_on_dark",
                "value" : "ace/theme/pastel_on_dark"
            }, {
                "textContent" : "solarized_dark",
                "value" : "ace/theme/solarized_dark"
            }, {
                "textContent" : "solarized_light",
                "value" : "ace/theme/solarized_light"
            }, {
                "textContent" : "textmate",
                "value" : "ace/theme/textmate"
            }, {
                "textContent" : "tomorrow",
                "value" : "ace/theme/tomorrow"
            }, {
                "textContent" : "tomorrow_night",
                "value" : "ace/theme/tomorrow_night"
            }, {
                "textContent" : "tomorrow_night_blue",
                "value" : "ace/theme/tomorrow_night_blue"
            }, {
                "textContent" : "tomorrow_night_bright",
                "value" : "ace/theme/tomorrow_night_bright"
            }, {
                "textContent" : "tomorrow_night_eighties",
                "value" : "ace/theme/tomorrow_night_eighties"
            }, {
                "textContent" : "twilight",
                "value" : "ace/theme/twilight"
            }, {
                "textContent" : "vibrant_ink",
                "value" : "ace/theme/vibrant_ink"
            }, {
                "textContent" : "xcode",
                "value" : "ace/theme/xcode"
            }
        ],
        "setMode" : [{
                "textContent" : "abap",
                "value" : "ace/mode/abap"
            }, {
                "textContent" : "asciidoc",
                "value" : "ace/mode/asciidoc"
            }, {
                "textContent" : "c9search",
                "value" : "ace/mode/c9search"
            }, {
                "textContent" : "clojure",
                "value" : "ace/mode/clojure"
            }, {
                "textContent" : "coffee",
                "value" : "ace/mode/coffee"
            }, {
                "textContent" : "coldfusion",
                "value" : "ace/mode/coldfusion"
            }, {
                "textContent" : "csharp",
                "value" : "ace/mode/csharp"
            }, {
                "textContent" : "css",
                "value" : "ace/mode/css"
            }, {
                "textContent" : "curly",
                "value" : "ace/mode/curly"
            }, {
                "textContent" : "c_cpp",
                "value" : "ace/mode/c_cpp"
            }, {
                "textContent" : "dart",
                "value" : "ace/mode/dart"
            }, {
                "textContent" : "diff",
                "value" : "ace/mode/diff"
            }, {
                "textContent" : "django",
                "value" : "ace/mode/django"
            }, {
                "textContent" : "dot",
                "value" : "ace/mode/dot"
            }, {
                "textContent" : "ftl",
                "value" : "ace/mode/ftl"
            }, {
                "textContent" : "glsl",
                "value" : "ace/mode/glsl"
            }, {
                "textContent" : "golang",
                "value" : "ace/mode/golang"
            }, {
                "textContent" : "groovy",
                "value" : "ace/mode/groovy"
            }, {
                "textContent" : "haml",
                "value" : "ace/mode/haml"
            }, {
                "textContent" : "haxe",
                "value" : "ace/mode/haxe"
            }, {
                "textContent" : "html",
                "value" : "ace/mode/html"
            }, {
                "textContent" : "jade",
                "value" : "ace/mode/jade"
            }, {
                "textContent" : "java",
                "value" : "ace/mode/java"
            }, {
                "textContent" : "javascript",
                "value" : "ace/mode/javascript"
            }, {
                "textContent" : "json",
                "value" : "ace/mode/json"
            }, {
                "textContent" : "jsp",
                "value" : "ace/mode/jsp"
            }, {
                "textContent" : "jsx",
                "value" : "ace/mode/jsx"
            }, {
                "textContent" : "latex",
                "value" : "ace/mode/latex"
            }, {
                "textContent" : "less",
                "value" : "ace/mode/less"
            }, {
                "textContent" : "liquid",
                "value" : "ace/mode/liquid"
            }, {
                "textContent" : "lisp",
                "value" : "ace/mode/lisp"
            }, {
                "textContent" : "livescript",
                "value" : "ace/mode/livescript"
            }, {
                "textContent" : "logiql",
                "value" : "ace/mode/logiql"
            }, {
                "textContent" : "lsl",
                "value" : "ace/mode/lsl"
            }, {
                "textContent" : "lua",
                "value" : "ace/mode/lua"
            }, {
                "textContent" : "luapage",
                "value" : "ace/mode/luapage"
            }, {
                "textContent" : "lucene",
                "value" : "ace/mode/lucene"
            }, {
                "textContent" : "makefile",
                "value" : "ace/mode/makefile"
            }, {
                "textContent" : "markdown",
                "value" : "ace/mode/markdown"
            }, {
                "textContent" : "objectivec",
                "value" : "ace/mode/objectivec"
            }, {
                "textContent" : "ocaml",
                "value" : "ace/mode/ocaml"
            }, {
                "textContent" : "pascal",
                "value" : "ace/mode/pascal"
            }, {
                "textContent" : "perl",
                "value" : "ace/mode/perl"
            }, {
                "textContent" : "pgsql",
                "value" : "ace/mode/pgsql"
            }, {
                "textContent" : "php",
                "value" : "ace/mode/php"
            }, {
                "textContent" : "powershell",
                "value" : "ace/mode/powershell"
            }, {
                "textContent" : "python",
                "value" : "ace/mode/python"
            }, {
                "textContent" : "r",
                "value" : "ace/mode/r"
            }, {
                "textContent" : "rdoc",
                "value" : "ace/mode/rdoc"
            }, {
                "textContent" : "rhtml",
                "value" : "ace/mode/rhtml"
            }, {
                "textContent" : "ruby",
                "value" : "ace/mode/ruby"
            }, {
                "textContent" : "sass",
                "value" : "ace/mode/sass"
            }, {
                "textContent" : "scad",
                "value" : "ace/mode/scad"
            }, {
                "textContent" : "scala",
                "value" : "ace/mode/scala"
            }, {
                "textContent" : "scheme",
                "value" : "ace/mode/scheme"
            }, {
                "textContent" : "scss",
                "value" : "ace/mode/scss"
            }, {
                "textContent" : "sh",
                "value" : "ace/mode/sh"
            }, {
                "textContent" : "sql",
                "value" : "ace/mode/sql"
            }, {
                "textContent" : "stylus",
                "value" : "ace/mode/stylus"
            }, {
                "textContent" : "svg",
                "value" : "ace/mode/svg"
            }, {
                "textContent" : "tcl",
                "value" : "ace/mode/tcl"
            }, {
                "textContent" : "tex",
                "value" : "ace/mode/tex"
            }, {
                "textContent" : "text",
                "value" : "ace/mode/text"
            }, {
                "textContent" : "textile",
                "value" : "ace/mode/textile"
            }, {
                "textContent" : "tmsnippet",
                "value" : "ace/mode/tmsnippet"
            }, {
                "textContent" : "tm_snippet",
                "value" : "ace/mode/tm_snippet"
            }, {
                "textContent" : "toml",
                "value" : "ace/mode/toml"
            }, {
                "textContent" : "typescript",
                "value" : "ace/mode/typescript"
            }, {
                "textContent" : "vbscript",
                "value" : "ace/mode/vbscript"
            }, {
                "textContent" : "xml",
                "value" : "ace/mode/xml"
            }, {
                "textContent" : "xquery",
                "value" : "ace/mode/xquery"
            }, {
                "textContent" : "yaml",
                "value" : "ace/mode/yaml"
            }
        ]
    };
};

module.exports.prototype.aceShowKeybordShortcuts = function () {
    "use strict";
    var el = document.createElement('pre');
    var x;
    el.innerHTML = '<h1>Keyboard Shortcuts</h1><dl>';
    for(x in this.editor.commands.byName) {
        if(this.editor.commands.byName[x].bindKey) {
            el.innerHTML += '<dt>' + x + '</dt>' +
                '<dd>Win: ' + this.editor.commands.byName[x].bindKey.win +
                '<br/>Mac: ' + this.editor.commands.byName[x].bindKey.mac + '</dd>';
        }
    }
    el.innerHTML += '</dl>';
    
    el.style.cssText = 'margin:0; padding:0; background-color:white; color:black; ' +
        'white-space: pre-wrap;';
    this.overlayPage(el, '0', '0', '0', null);
};

module.exports.prototype.aceShowSettingsMenu = function () {
    "use strict";
    var my = this;
    
    var topmenu = document.createElement('div');
    
    function createCheckbox (id, checked, clss) {
        var el = document.createElement('input');
        el.setAttribute('type', 'checkbox');
        el.setAttribute('id', id);
        el.setAttribute('name', id);
        el.setAttribute('value', checked);
        el.setAttribute('class', clss);
        if(checked) {
            el.setAttribute('checked', 'checked');
        }
        return el;
    }
    function createInput (id, value, clss) {
        var el = document.createElement('input');
        el.setAttribute('type', 'text');
        el.setAttribute('id', id);
        el.setAttribute('name', id);
        el.setAttribute('value', value);
        el.setAttribute('class', clss);
        return el;
    }
    function createOption (obj) {
        var attribute;
        var el = document.createElement('option');
        for(attribute in obj) {
            if(el.hasOwnProperty(attribute)) {
                if(attribute === 'selected') {
                    el.setAttribute(attribute, obj[attribute]);
                }
                el[attribute] = obj[attribute];
            }
        }
        return el;
    }
    function createSelection (id, values, clss) {
        var selected;
        var el = document.createElement('select');
        el.setAttribute('id', id);
        el.setAttribute('name', id);
        el.setAttribute('class', clss);
        values.forEach(function (item) {
            el.appendChild(createOption(item));
        });
        return el;
    }
    function createLabel (text, labelFor) {
        var el = document.createElement('label');
        el.setAttribute('for', labelFor);
        el.textContent = text;
        return el;
    }
    function createNewEntry(obj, clss, item, val) {
        var el;
        var div = document.createElement('div');
        div.setAttribute('contains', item);
        div.setAttribute('class', 'menuEntry');
        
        div.appendChild(createLabel(item, item));
        
        if(Array.isArray(val)) {
            el = createSelection(item, val, clss);
            el.addEventListener('change', function (e) {
                try{
                    my.options[e.target.id].forEach(function (x) {
                        if(x.textContent !== e.target.textContent) {
                            delete  x.selected;
                        }
                    });
                    obj[e.target.id](e.target.value);
                } catch (err) {
                    console.dir(err);
                }
            });
        } else if(typeof val === 'boolean') {
            el = createCheckbox(item, val, clss);
            el.addEventListener('change', function (e) {
                try{
                    obj[e.target.id](!!e.target.checked);
                } catch (err) {
                    console.dir(err);
                }
            });
        } else {
            el = createInput(item, val, clss);
            el.addEventListener('blur', function (e) {
                try{
                    if(e.target.value === 'true') {
                        obj[e.target.id](true);
                    } else if(e.target.value === 'false') {
                        obj[e.target.id](false);
                    } else {
                        obj[e.target.id](e.target.value);
                    }
                } catch (err) {
                    console.dir(err);
                }
            });
        }
        div.appendChild(el);
        return div;
    }
    function buildSettingsMenu() {
        var elements = [];
        var opts = [];
        
        var skip = [
            'setOption',
            'setUndoManager',
            'setDocument',
            'setValue',
            'setBreakpoints',
            'setScrollTop',
            'setScrollLeft',
            'setSelectionStyle',
            'setWrapLimitRange',
            'setKeyboardHandler'
        ];
        
        function makeDropdown(item, esr, clss, fn) {
            var val = my.options[item];
            val = val.map(function (valuex) {
                if(valuex.value === esr[fn]()) {
                    valuex.selected = 'selected';
                } else if(valuex.value === esr.$modeId) {
                    // is mode
                    valuex.selected = 'selected';
                }
                return valuex;
            });
            return createNewEntry(esr, clss, item, val);
        }
        
        function handleSet (item, esr, clss) {
            opts.push(item);
            var val;
            var fn = item.replace(/^set/, 'get');
            if(my.options[item] !== undefined) {
                elements.push(makeDropdown(item, esr, clss, fn));
            } else if(typeof esr[fn] === 'function') {
                // has get function
                try {
                    val = esr[fn]();
                    if(typeof val === 'object') {
                        val = val.$id;
                    }
                    elements.push(
                        createNewEntry(esr, clss, item, val)
                    );
                } catch (e) {
                }
            }
        }
        
        function cleanupElementsList() {
            elements.sort(function (a, b) {
                var x = a.getAttribute('contains');
                var y = b.getAttribute('contains');
                return x.localeCompare(y);
            });
        }
        
        function showMenu() {
            elements.forEach(function (element) {
                topmenu.appendChild(element);
            });
        }
        
        function doMuchMoreEffortThanNecessary () {
            [
                [my.editor.renderer, 'my.editor.renderer'],
                [my.session, 'my.session'],
                [my.editor, 'my.editor']
            ].forEach(function (esra) {
                var item;
                var esr = esra[0];
                var clss = esra[1];
                for(item in esr) {
                    if(skip.indexOf(item) === -1) {
                        if(/^set/.test(item) && opts.indexOf(item) === -1) {
                            // found set function
                            handleSet(item, esr, clss);
                        }
                    }
                }
            });
        }
        doMuchMoreEffortThanNecessary();
        cleanupElementsList();
        showMenu();
    }
    buildSettingsMenu();
    this.overlayPage(topmenu, '0', '0', '0', null);
};


