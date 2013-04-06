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

ace.define('ace/ext/show_settings_menu', ['require', 'exports', 'module' , 'ace/ext/menu_tools/overlay_page', 'ace/ext/menu_tools/generate_settings_menu', 'ace/editor'], function(require, exports, module) {
    function showSettingsMenu (editor) {
        var overlayPage = require('./menu_tools/overlay_page').overlayPage;
        var generateSettingsMenu = require(
            './menu_tools/generate_settings_menu').generateSettingsMenu;
        if(!document.getElementById('settingsmenu')) {
            overlayPage(editor, generateSettingsMenu(editor), '0', '0', '0');
        }
    }
    module.exports.init = function (editor) {
        var Editor = require("ace/editor").Editor;
        Editor.prototype.showSettingsMenu = function () {
            showSettingsMenu(this);
        };
        editor.commands.addCommands([{
            name: "showSettingsMenu",
            bindKey: {win: "Ctrl-q", mac: "Command-q"},
            exec: function(editor, line) {
                editor.showSettingsMenu();
            },
            readOnly: true
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

ace.define('ace/ext/menu_tools/generate_settings_menu', ['require', 'exports', 'module' , 'ace/ext/menu_tools/add_editor_menu_options', 'ace/ext/menu_tools/get_set_functions', 'ace/ext/menu_tools/element_generator'], function(require, exports, module) {
module.exports.generateSettingsMenu = function generateSettingsMenu (editor) {
    var addEditorMenuOptions = require('./add_editor_menu_options').addEditorMenuOptions;
    var getSetFunctions = require('./get_set_functions').getSetFunctions;
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
        
        div.appendChild(egen.createLabel(
            item.replace(
                    /^set/, ''
                ).replace(
                    /([A-Z])/g, ' $1'
                ).trim(),
            item
        ));
        
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
    addEditorMenuOptions(editor);
    getSetFunctions(editor).forEach(function (setObj) {
        handleSet(setObj);
    });
    cleanupElementsList();
    return wrapElements();
};

});

ace.define('ace/ext/menu_tools/add_editor_menu_options', ['require', 'exports', 'module' , 'ace/ext/modelist', 'ace/ext/themelist'], function(require, exports, module) {
module.exports.addEditorMenuOptions = function addEditorMenuOptions (editor) {
    var modelist = require('../modelist');
    var themelist = require('../themelist');
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
        "setTheme" : [],
        "setMode" : []
    };
    
    editor.menuOptions.setTheme = themelist.themes.map(function (theme) {
        return {
            'textContent' : theme.desc,
            'value' : theme.theme
        };
    });
    
    editor.menuOptions.setMode = modelist.modes.map(function (mode) {
        return {
            'textContent' : mode.name,
            'value' : mode.mode
        };
    });
};


});ace.define('ace/ext/modelist', ['require', 'exports', 'module' ], function(require, exports, module) {
var modes = [];
function getModeFromPath(path) {
    var mode = modesByName.text;
    var fileName = path.split(/[\/\\]/).pop();
    for (var i = 0; i < modes.length; i++) {
        if (modes[i].supportsFile(fileName)) {
            mode = modes[i];
            break;
        }
    }
    return mode;
}

var Mode = function(name, desc, extensions) {
    this.name = name;
    this.desc = desc;
    this.mode = "ace/mode/" + name;
    if (/\^/.test(extensions)) {
        var re = extensions.replace(/\|(\^)?/g, function(a, b){
            return "$|" + (b ? "^" : "^.*\\.");
        }) + "$";
    } else {
        var re = "^.*\\.(" + extensions + ")$";
    }   

    this.extRe = new RegExp(re, "gi");
};

Mode.prototype.supportsFile = function(filename) {
    return filename.match(this.extRe);
};
var modesByName = {
    abap:       ["ABAP"         , "abap"],
    asciidoc:   ["AsciiDoc"     , "asciidoc"],
    c9search:   ["C9Search"     , "c9search_results"],
    coffee:     ["CoffeeScript" , "^Cakefile|coffee|cf|cson"],
    coldfusion: ["ColdFusion"   , "cfm"],
    csharp:     ["C#"           , "cs"],
    css:        ["CSS"          , "css"],
    curly:      ["Curly"        , "curly"],
    dart:       ["Dart"         , "dart"],
    diff:       ["Diff"         , "diff|patch"],
    dot:        ["Dot"          , "dot"],
    ftl:        ["FreeMarker"   , "ftl"],
    glsl:       ["Glsl"         , "glsl|frag|vert"],
    golang:     ["Go"           , "go"],
    groovy:     ["Groovy"       , "groovy"],
    haxe:       ["haXe"         , "hx"],
    haml:       ["HAML"         , "haml"],
    html:       ["HTML"         , "htm|html|xhtml"],
    c_cpp:      ["C/C++"        , "c|cc|cpp|cxx|h|hh|hpp"],
    clojure:    ["Clojure"      , "clj"],
    jade:       ["Jade"         , "jade"],
    java:       ["Java"         , "java"],
    jsp:        ["JSP"          , "jsp"],
    javascript: ["JavaScript"   , "js"],
    json:       ["JSON"         , "json"],
    jsx:        ["JSX"          , "jsx"],
    latex:      ["LaTeX"        , "latex|tex|ltx|bib"],
    less:       ["LESS"         , "less"],
    lisp:       ["Lisp"         , "lisp"],
    scheme:     ["Scheme"       , "scm|rkt"],
    liquid:     ["Liquid"       , "liquid"],
    livescript: ["LiveScript"   , "ls"],
    logiql:     ["LogiQL"       , "logic|lql"],
    lua:        ["Lua"          , "lua"],
    luapage:    ["LuaPage"      , "lp"], // http://keplerproject.github.com/cgilua/manual.html#templates
    lucene:     ["Lucene"       , "lucene"],
    lsl:        ["LSL"          , "lsl"],
    makefile:   ["Makefile"     , "^GNUmakefile|^makefile|^Makefile|^OCamlMakefile|make"],
    markdown:   ["Markdown"     , "md|markdown"],
    mushcode:   ["TinyMUSH"     , "mc|mush"],
    objectivec: ["Objective-C"  , "m"],
    ocaml:      ["OCaml"        , "ml|mli"],
    pascal:     ["Pascal"       , "pas|p"],
    perl:       ["Perl"         , "pl|pm"],
    pgsql:      ["pgSQL"        , "pgsql"],
    php:        ["PHP"          , "php|phtml"],
    powershell: ["Powershell"   , "ps1"],
    python:     ["Python"       , "py"],
    r:          ["R"            , "r"],
    rdoc:       ["RDoc"         , "Rd"],
    rhtml:      ["RHTML"        , "Rhtml"],
    ruby:       ["Ruby"         , "ru|gemspec|rake|rb"],
    scad:       ["OpenSCAD"     , "scad"],
    scala:      ["Scala"        , "scala"],
    scss:       ["SCSS"         , "scss"],
    sass:       ["SASS"         , "sass"],
    sh:         ["SH"           , "sh|bash|bat"],
    sql:        ["SQL"          , "sql"],
    stylus:     ["Stylus"       , "styl|stylus"],
    svg:        ["SVG"          , "svg"],
    tcl:        ["Tcl"          , "tcl"],
    tex:        ["Tex"          , "tex"],
    text:       ["Text"         , "txt"],
    textile:    ["Textile"      , "textile"],
    tmsnippet:  ["tmSnippet"    , "tmSnippet"],
    toml:       ["toml"         , "toml"],
    typescript: ["Typescript"   , "typescript|ts|str"],
    vbscript:   ["VBScript"     , "vbs"],
    xml:        ["XML"          , "xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl"],
    xquery:     ["XQuery"       , "xq"],
    yaml:       ["YAML"         , "yaml"]
};

for (var name in modesByName) {
    var mode = modesByName[name];
    mode = new Mode(name, mode[0], mode[1]);
    modesByName[name] = mode;
    modes.push(mode);
}

module.exports = {
    getModeFromPath: getModeFromPath,
    modes: modes,
    modesByName: modesByName
};

});

ace.define('ace/ext/themelist', ['require', 'exports', 'module' , 'ace/ext/themelist_utils/themes'], function(require, exports, module) {
module.exports.themes = require('ace/ext/themelist_utils/themes').themes;
module.exports.ThemeDescription = function(name) {
    this.name = name;
    this.desc = name.split('_'
        ).map(
            function (namePart) {
                return namePart[0].toUpperCase() + namePart.slice(1);
            }
        ).join(' ');
    this.theme = "ace/theme/" + name;
};

module.exports.themesByName = {};

module.exports.themes = module.exports.themes.map(function (name) {
    module.exports.themesByName[name] = new module.exports.ThemeDescription(name);
    return module.exports.themesByName[name];
});

});

ace.define('ace/ext/themelist_utils/themes', ['require', 'exports', 'module' ], function(require, exports, module) {

module.exports.themes = [
    "ambiance",
    "chaos",
    "chrome",
    "clouds",
    "clouds_midnight",
    "cobalt",
    "crimson_editor",
    "dawn",
    "dreamweaver",
    "eclipse",
    "github",
    "idle_fingers",
    "kr_theme",
    "merbivore",
    "merbivore_soft",
    "monokai",
    "mono_industrial",
    "pastel_on_dark",
    "solarized_dark",
    "solarized_light",
    "terminal",
    "textmate",
    "tomorrow",
    "tomorrow_night",
    "tomorrow_night_blue",
    "tomorrow_night_bright",
    "tomorrow_night_eighties",
    "twilight",
    "vibrant_ink",
    "xcode"
];

});

ace.define('ace/ext/menu_tools/get_set_functions', ['require', 'exports', 'module' ], function(require, exports, module) {
module.exports.getSetFunctions = function getSetFunctions (editor) {
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
};

});

ace.define('ace/ext/menu_tools/element_generator', ['require', 'exports', 'module' ], function(require, exports, module) {
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