'use strict';

const fs = require('fs');

function pathExists(path, err) {
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
        console.log('Created:', dest);
    });
}

module.exports = {
    copyFile: copyFile,
    pathExists: pathExists,
    hyphenateString: hyphenateString,
    capitalizeFirstLetter: capitalizeFirstLetter
};