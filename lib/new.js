'use strict';

var fse = require('fs-extra');
var config = require('./config');

// function moveFile() {
//     fse.copy('./base/config.json', '../config.json', function (err) {
//         if (err) console.error;
//         console.log('Moved file successfully!');
//     });
// }

function newSite() {
    for (var files in config().paths) {
        if (!config().paths.hasOwnProperty(files)) {
            continue;
        } else {
            fse.copy(config().paths[files], './base', function (err) {
                if (err) console.error;
                console.log('Moved directory successfully!');
            });
        }
    }
}

module.exports = newSite