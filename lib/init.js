'use strict';

const fs = require('fs');
const path = require('path');
const utils = require('./utils');

const configFilename = '_statgen.json';
const configSrc = __dirname + '/src/' + configFilename;
const configDest = path.resolve(process.cwd() + '/' + configFilename);

module.exports = () => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(configDest)) {
            console.log(`Statgen: Aborted. ${configFilename} already exists.`);
            reject();
            process.exit(1);
        } else {
            // utils.copyFile(configSrc, configDest);

            const data = fs.readFileSync(configSrc, 'utf-8');
            utils.createFileWithPath(configDest, data);

            resolve();
        }
    });
}