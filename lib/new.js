'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const init = require('./init');
const utils = require('./utils');

function copySrc() {
    const src = `${__dirname}/src/`;
    const files = fs.readdirSync(src);

    files.forEach((file) => {
        const filePath = src + file;
        if (fs.statSync(filePath).isDirectory()) {
            copyDirectory(file);
        }
    });
}

function copyDirectory(dir) {
    const dirPath = __dirname + '/src/' + dir + '/';
    const files = fs.readdirSync(dirPath);
    const localPath = process.cwd() + '/' + dir + '/';

    files.forEach((file) => {
        const filePath = dirPath + file;
        if (fs.statSync(filePath).isDirectory()) {
            mkdirp(localPath + file, (err) => {
                copyDirectory(dir + '/' + file);
            });
        } else {
            const data = fs.readFileSync(filePath, 'utf-8');
            utils.createFileWithPath(localPath + file, data);
        }
    });
}

module.exports = () => {
    Promise.all([
        init(),
        copySrc()
    ]).then(() => {
        console.log('Statgen: New site created. Use "statgen build" to generate the site.');
    });
}; 