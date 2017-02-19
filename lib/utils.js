'use strict';

var fs = require('fs');

var paths = {
    src: './lib/src/',
    config: '_config.json',
};

function pathExists(path, err) {
    try {
        fs.statSync(path);
        return true;
    } catch (err) {
        return false;
    }
}

function hyphenateString(str) {
    return str.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
}

function copyFile(src, dest) {
    var data = fs.readFileSync(src, 'utf-8');

    fs.writeFile(dest, data, function (err) {
        if (err) return err;
    });
}

module.exports = {
    copyFile: copyFile,
    paths: paths,
    pathExists: pathExists,
    hyphenateString: hyphenateString
};