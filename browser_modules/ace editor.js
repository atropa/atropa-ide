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

module.exports.prototype.initializeAce = function (options) {
    "use strict";
    options = options || {};
    var my = this;
    var defaults = require('./ace editor default settings.js');
    
    function loadFile (files) {
        my.loadFile(files);
    }
    
    function initializeEditor () {
        
        function mergeGivenOptionsWithDefaults () {
            Object.keys(defaults).forEach(function (setting) {
                options[setting] = options[setting] || defaults[setting];
            });
        }
        
        function setEditorSettings () {
            my.getSetFunctions(function (fn, esr) {
                if(options[fn] !== undefined) {
                    esr[fn](options[fn]);
                }
            });
        }
        
        mergeGivenOptionsWithDefaults();
        my.textarea = document.getElementById('newFile');
        my.editor = ace.edit("editor");
        my.session = my.editor.getSession();
        my.renderer = my.editor.renderer;
        my.editor.getFontSize = function () {
            return getComputedStyle(
                ui.editor.container).getPropertyValue('font-size');
        };
        my.session.setWrapLimit = function (limit) {
            my.session.setWrapLimitRange(limit, limit);
        };
        my.editor.commands.addCommand({
            name: "save",
            bindKey: {win: "Ctrl-S", mac: "Command-S"},
            exec: function() {
                my.save();
            }
        });
        setEditorSettings();
    }
    
    this.getSetFunctions = function getSetFunctions (callback) {
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
                        // found set function
                        opts.push(fn);
                        callback(fn, esr, clss);
                    }
                }
            }
        });
    };
    
    this.save = function () {
        var code = this.session.getValue();
        my.textarea.textContent = code;
        document.forms[0].submit();
    };
    
    this.setEditorValue = function (value) {
        my.session.setValue(value);
    };
    
    this.catchDroppedFiles(document.getElementById('editor'), loadFile);
    
    this.menuOptions = require('./ace editor settings menu options.js');
    
    initializeEditor();
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
                    my.menuOptions[e.target.id].forEach(function (x) {
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
            el = createCheckbox(item, val, clss);
            el.addEventListener('change', function (e) {
                try{
                    obj[e.target.id](!!e.target.checked);
                } catch (err) {
                    throw new Error(err);
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
                    throw new Error(err);
                }
            });
        }
        div.appendChild(el);
        return div;
    }
    function buildSettingsMenu() {
        var elements = [];
        
        function makeDropdown(item, esr, clss, fn) {
            var val = my.menuOptions[item];
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
            var val;
            var fn = item.replace(/^set/, 'get');
            if(my.menuOptions[item] !== undefined) {
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
        
        my.getSetFunctions(handleSet);
        cleanupElementsList();
        showMenu();
    }
    buildSettingsMenu();
    this.overlayPage(topmenu, '0', '0', '0', null);
};


