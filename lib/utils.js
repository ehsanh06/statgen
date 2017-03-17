'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');

function pathExists(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (err) {
        return false;
    }
}

function hyphenateString(string) {
    return string.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function copyFile(src, dest) {
    const data = fs.readFileSync(src, 'utf-8');

    fs.writeFile(dest, data, function (err) {
        if (err) return err;
    });
}

function createFileWithPath(filePath, data) {
    const file = filePath.split('/').pop();
    const path = filePath.split(file)[0];

    return new Promise((resolve, reject) => {
        mkdirp(path, (err) => {
            if (err) return reject;
            fs.writeFile(filePath, data, (err) => {
                if (err) return reject;
                resolve(filePath);
            });
        });
    })
}

module.exports = {
    copyFile,
    pathExists,
    hyphenateString,
    capitalizeFirstLetter,
    createFileWithPath
};