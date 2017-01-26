'use strict';

var fs = require('fs-extra');
var config = require('./config');

function project() {
    console.log(config());
}

function moveFile() {
    fs.copy('./base/config.json', '../config.json', function (err) {
        if (err) console.error;
        console.log('Moved file successfully!');
    });
}

function moveDirectory() {
    for (var files in config().paths) {
        if (!config().paths.hasOwnProperty(files)) {
            continue;
        } else {
            fs.copy(config().paths[files], './base', function (err) {
                if (err) console.error;
                console.log('Moved directory successfully!');
            });
        }


    }
}
moveDirectory();

module.exports = {
    project: project,
    moveFile: moveFile
}