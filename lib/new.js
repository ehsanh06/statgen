'use strict';

const fs = require('fs');
const path = require('path');
const init = require('./init');
const page = require('./page');
const post = require('./post');
const utils = require('./utils');

const dirSrc = `${__dirname}/src/`;

function copySrcDirectories() {
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(dirSrc);
        files.forEach((file) => {
            const filePath = dirSrc + file;
            if (fs.statSync(filePath).isDirectory()) {
                const localPath = path.resolve(process.cwd() + '/' + file);
                fs.mkdir(localPath, (err) => {
                    if (err) console.error;
                    copyContentsFromDirectory(filePath, localPath);
                });
            }
        });
        resolve();
    });
}

function copyContentsFromDirectory(src, dest) {
    const files = fs.readdirSync(src);
    files.forEach((file) => {
        utils.copyFile(path.resolve(src + '/' + file), path.resolve(dest + '/' + file));
    });
}

module.exports = () => {
    Promise.all([
        init(),
        copySrcDirectories()
    ]).then(() => {
        console.log('Statgen: New site created. Use "statgen build" to generate the site.');
    });
}; 