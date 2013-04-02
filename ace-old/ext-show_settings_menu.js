/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/

ace.define('ace/ext/show_settings_menu', ['require', 'exports', 'module' , 'ace/ext/overlay_page', 'ace/ext/add_editor_menu_options', 'ace/ext/element_generator'], function(require, exports, module) {
    
    var overlayPage = require('./overlay_page').overlayPage;
    var addEditorMenuOptions = require('./add_editor_menu_options').addEditorMenuOptions;
    function addFunctionsForSettingsMenu (editor) {

        editor.getFontSize = function () {
            return getComputedStyle(
                editor.container).getPropertyValue('font-size');
        };
        editor.session.setWrapLimit = function (limit) {
            editor.session.setWrapLimitRange(limit, limit);
        };
    }
    function getSetFunctions (editor) {
        var out = [];
        var my = {
            'editor' : editor,
            'session' : editor.session,
            'renderer' : editor.renderer
        };
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
        [
            'renderer',
            'session',
            'editor'
        ].forEach(function (esra) {
            var fn;
            var esr = my[esra];
            var clss = esra;
            for(fn in esr) {
                if(skip.indexOf(fn) === -1) {
                    if(/^set/.test(fn) && opts.indexOf(fn) === -1) {
                        opts.push(fn);
                        out.push({
                            'functionName' : fn,
                            'parentObj' : esr,
                            'parentName' : clss
                        });
                    }
                }
            }
        });
        return out;
    }
    function generateMenu (editor) {
        var elements = [];
        function cleanupElementsList() {
            elements.sort(function (a, b) {
                var x = a.getAttribute('contains');
                var y = b.getAttribute('contains');
                return x.localeCompare(y);
            });
        }
        function wrapElements() {
            var topmenu = document.createElement('div');
            topmenu.setAttribute('id', 'settingsmenu');
            elements.forEach(function (element) {
                topmenu.appendChild(element);
            });
            return topmenu;
        }
        function createNewEntry(obj, clss, item, val) {
            var egen = require('./element_generator');
            var el;
            var div = document.createElement('div');
            div.setAttribute('contains', item);
            div.setAttribute('class', 'menuEntry');
            div.setAttribute('style', 'clear: both;');
            
            div.appendChild(egen.createLabel(item, item));
            
            if(Array.isArray(val)) {
                el = egen.createSelection(item, val, clss);
                el.addEventListener('change', function (e) {
                    try{
                        editor.menuOptions[e.target.id].forEach(function (x) {
                            if(x.textContent !== e.target.textContent) {
                                delete x.selected;
                            }
                        });
                        obj[e.target.id](e.target.value);
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            } else if(typeof val === 'boolean') {
                el = egen.createCheckbox(item, val, clss);
                el.addEventListener('change', function (e) {
                    try{
                        obj[e.target.id](!!e.target.checked);
                    } catch (err) {
                        throw new Error(err);
                    }
                });
            } else {
                el = egen.createInput(item, val, clss);
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
                        throw new Error(err);
                    }
                });
            }
            el.style.cssText = 'float:right;';
            div.appendChild(el);
            return div;
        }
        function makeDropdown(item, esr, clss, fn) {
            var val = editor.menuOptions[item];
            val = val.map(function (valuex) {
                if(valuex.value === esr[fn]()) {
                    valuex.selected = 'selected';
                } else if(valuex.value === esr.$modeId) {
                    valuex.selected = 'selected';
                }
                return valuex;
            });
            return createNewEntry(esr, clss, item, val);
        }
        function handleSet (setObj) {
            var item = setObj.functionName;
            var esr = setObj.parentObj;
            var clss = setObj.parentName;
            var val;
            var fn = item.replace(/^set/, 'get');
            if(editor.menuOptions[item] !== undefined) {
                elements.push(makeDropdown(item, esr, clss, fn));
            } else if(typeof esr[fn] === 'function') {
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
        getSetFunctions(editor).forEach(function (setObj) {
            handleSet(setObj);
        });
        cleanupElementsList();
        overlayPage(wrapElements(), '0', '0', '0', '75%');
    }
    module.exports.showSettingsMenu = function showSettingsMenu (editor) {
        if(!document.getElementById('settingsmenu')) {
            addFunctionsForSettingsMenu(editor);
            addEditorMenuOptions(editor);
            generateMenu(editor);
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
 
ace.define('ace/ext/add_editor_menu_options', ['require', 'exports', 'module' ], function(require, exports, module) {
module.exports.addEditorMenuOptions = function addEditorMenuOptions (editor) {
    editor.menuOptions = {
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


});

ace.define('ace/ext/element_generator', ['require', 'exports', 'module' ], function(require, exports, module) {
module.exports.createOption = function createOption (obj) {
    var attribute;
    var el = document.createElement('option');
    for(attribute in obj) {
        if(obj.hasOwnProperty(attribute)) {
            if(attribute === 'selected') {
                el.setAttribute(attribute, obj[attribute]);
            } else {
                el[attribute] = obj[attribute];
            }
        }
    }
    return el;
};
module.exports.createCheckbox = function createCheckbox (id, checked, clss) {
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
};
module.exports.createInput = function createInput (id, value, clss) {
    var el = document.createElement('input');
    el.setAttribute('type', 'text');
    el.setAttribute('id', id);
    el.setAttribute('name', id);
    el.setAttribute('value', value);
    el.setAttribute('class', clss);
    return el;
};
module.exports.createLabel = function createLabel (text, labelFor) {
    var el = document.createElement('label');
    el.setAttribute('for', labelFor);
    el.textContent = text;
    return el;
};
module.exports.createSelection = function createSelection (id, values, clss) {
    var el = document.createElement('select');
    el.setAttribute('id', id);
    el.setAttribute('name', id);
    el.setAttribute('class', clss);
    values.forEach(function (item) {
        el.appendChild(module.exports.createOption(item));
    });
    return el;
};

});