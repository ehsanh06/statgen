'use strict';

var fs = require('fs');

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

module.exports = {
    pathExists: pathExists,
    hyphenateString: hyphenateString
};