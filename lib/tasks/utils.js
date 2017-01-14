'use strict';

// Checking if directory exists
var dirExists = function (path, err) {
    try {
        fs.statSync(path);
        return true;
    } catch (err) {
        return false;
    }
}

// Function which takes care of slug
var hyphenateString = function (slug) {

    // Convert slug to lowercase, trim whitespace, replace any /'s with '-'s
    return slug.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
};


// Module Export methods
module.exports = {
    dirExists: dirExists,
    hyphenateString: hyphenateString
};