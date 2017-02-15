'use strict';
var fs = require('fs');
var path = require('path');

var newSite = require('./new');
var utils = require('./utils');

function configExists() {
    var configSrc = newSite.paths.src + newSite.paths.config;
    var configDest = path.resolve(process.cwd() + '/' + newSite.paths.config);

    if (fs.existsSync(configDest)) {
        return console.log(newSite.paths.config, 'already exists in the cwd');
    } else {
        newSite.copyFile(configSrc, configDest);
        return console.log(newSite.paths.src, 'has been created at:' + configDest);
    }
}

module.exports = configExists;