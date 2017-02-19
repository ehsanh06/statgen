'use strict';
var fs = require('fs');
var path = require('path');
var utils = require('./utils');

function init() {
    var configSrc = utils.paths.src + utils.paths.config;
    var configDest = path.resolve(process.cwd() + '/' + utils.paths.config);

    if (fs.existsSync(configDest)) {
        return console.log(utils.paths.config, 'already exists in the cwd');
    } else {
        utils.copyFile(configSrc, configDest);
        return console.log(utils.paths.config, 'has been created at: ' + configDest);
    }
}

module.exports = init;