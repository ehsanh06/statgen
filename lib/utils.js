'use strict';

var fs = require('fs');

var directoryExists = function(path, err) {
    try {
        fs.statSync(path);
        return true;
    } catch (err) {
        return false;
    }
}

var hyphenateString = function(slug) {
    return slug.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
};

module.exports = {
    directoryExists: directoryExists,
    hyphenateString: hyphenateString
};