'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const configFilename = '_config.json';
const configPath = path.resolve(process.cwd() + '/' + configFilename);

module.exports = () => {
    if (utils.pathExists(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } else {
        console.log(`Error: No statgen ${ configFilename } file in root directory. Please use the command "statgen init" to create it.`);
        return process.exit(1);
    }
}