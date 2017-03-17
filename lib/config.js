'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const configFilename = '_statgen.json';
const configPath = path.resolve(process.cwd() + '/' + configFilename);

module.exports = () => {
    if (utils.pathExists(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } else {
        console.log(`Statgen: Error. No statgen ${configFilename} file in root directory. Use "statgen new" to create a new site.`);
        return process.exit(1);
    }
}