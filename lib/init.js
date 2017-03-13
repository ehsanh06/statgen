'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const configFilename = '_config.json';
const configSrc = __dirname + '/src/' + configFilename;
const configDest = path.resolve(process.cwd() + '/' + configFilename);

module.exports = () => {
    if (fs.existsSync(configDest)) {
        console.log(`Error: ${ configFilename } file already exists in the current directory`);
        process.exit(1);
    } else {
        utils.copyFile(configSrc, configDest);
    }
}