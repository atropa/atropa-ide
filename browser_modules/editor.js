/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
/*global
    FileReader,
    module
*/
module.exports = function () {
    "use strict";
    this.fileName = document.getElementById('fileName');
    this.fileName.value = document.title || 'new.js';
    this.fileMeta = {};
};

module.exports.prototype.setEditorValue = function (value) {
    "use strict";
    throw new Error('this function must be implemented on a per editor basis');
};

module.exports.prototype.save = function () {
    "use strict";
    throw new Error('this function must be implemented on a per editor basis');
};

module.exports.prototype.setPageTitle = function (title) {
    "use strict";
    document.getElementsByTagName('title')[0].textContent = title;
    this.fileName.value = title;
};

module.exports.prototype.catchDroppedFiles = function (dropElement, callback) {
    "use strict";
    function catchAndDoNothing(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    function drop(e) {
        catchAndDoNothing(e);
        callback(e.dataTransfer.files);
    }
    function dragAndDropHook () {
        dropElement.addEventListener("dragenter", catchAndDoNothing, false);
        dropElement.addEventListener("dragover", catchAndDoNothing, false);
        dropElement.addEventListener("drop", drop, false);
    }
    dragAndDropHook();
};

module.exports.prototype.loadFile = function (files, callback) {
    "use strict";
    var my = this;
    var file = files[0];
    
    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            my.fileMeta = file;
            my.setPageTitle(file.name);
            my.setEditorValue(contents);
            if(callback) {
                callback();
            }
        };
        reader.readAsText(file);
    } else {
        throw new Error("Failed to load file");
    }
};

module.exports.prototype.overlayPage = function (contentElement, top, right, bottom, left) {
    "use strict";
    var div = document.createElement('div');
    var contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'margin: 0px; padding: 0px; border: 0px;' +
        'overflow: auto;';
    contentElement.style.cssText = contentElement.style.cssText + 'overflow: auto;';
    contentContainer.appendChild(contentElement);
    
    var cl = document.createElement('img');
    if(top) {
        top = 'top: ' + top + ';';
    } else {
        top = '';
    }
    if(right) {
        right = 'right: ' + right + ';';
    } else {
        right = '';
    }
    if(bottom) {
        bottom = 'bottom: ' + bottom + ';';
    } else {
        bottom = '';
    }
    if(left) {
        left = 'left: ' + left + ';';
    } else {
        left = '';
    }
    
    cl.src = '/famfamfam_silk_icons_v013/icons/cross.png';
    cl.style.cssText = 'margin: 5px 5px 0 0; padding: 0; ' +
        'float: right; width: 25px;';
    div.style.cssText = 'margin:0; padding:0; position: absolute;' +
         top + right + bottom + left +
        'z-index:9999; background-color:white; color:black; overflow: auto;';
    
    div.appendChild(cl);
    div.appendChild(contentContainer);
    document.body.appendChild(div);
    
    cl.addEventListener('click', function (e) {
        div.parentNode.removeChild(div);
        div = null;
    });
};


