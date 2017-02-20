'use strict';
var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var paths = {
    src: './lib/src/',
    config: '_config.json',
};

function init() {
    var configSrc = paths.src + paths.config;
    var configDest = path.resolve(process.cwd() + '/' + paths.config);

    if (fs.existsSync(configDest)) {
        return console.log(paths.config, 'already exists in the cwd');
    } else {
        utils.copyFile(configSrc, configDest);
        return console.log(paths.config, 'has been created at: ' + configDest);
    }
}

module.exports = init;