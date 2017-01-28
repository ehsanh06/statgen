'use strict';

var fse = require('fs-extra');
var config = require('./config');

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

    fse.copy('./base/config.json', '../config.json', function (err) {
        if (err) console.error;
        console.log('Move file successfully');
    });
}

module.exports = newSite;