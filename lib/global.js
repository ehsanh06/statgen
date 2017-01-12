// Include Gulp, plugins and local files
var fs = require('fs');
var handlebars = require('handlebars');
var mkdirp = require('mkdirp');

// Define Base folders 
var srcDir = {
    pages: '../../../views/pages/',
    posts: '../../../views/posts/',
    drafts: '../../../views/drafts/',
    layouts: '../../../views/layouts/',
    includes: '../../../public/src/js/',
    sass: '../../../public/src/sass/*.scss',
    dist: '../../../dist/',
    distCss: '../../../dist/css/'
};

// siteData will hold the meta information for the site
var siteData = {
    posts: [],
    pages: [],
    archive: [],
    tags: [],
    navigation: []
};

// Functions
var build = function () {
    console.log('Build Initiated');
};

var createPage = function (data) {
    var html = template(data.pageData);
    var layout = fs.readFile(srcDir.layouts + data.layout + '.html', 'utf-8');
    var template = handlebars.compile(layout);

    // Create a directory relative to data.path
    mkdirp(data.path, function (err) {
        if (err) {
            return console.log(err);
        }

        // Write to the path of index in html format
        fs.writeFileSync(data.path + 'index.html', html, function (err) {
            if (err) {
                return err;
            }
        });
    });
}

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
var hyphenateSlug = function (slug) {

    // Convert slug to lowercase, trim whitespace, replace any /'s with '-'s
    return slug.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
};

// Setting the page title
var setPageTitle = function (title) { return title + ' - ' + srcDir.author; };


// Module Export methods
module.exports = {
    build: build,
    createPage: createPage,
    dirExists: dirExists,
    hyphenateSlug: hyphenateSlug,
    siteData: siteData,
    srcDir: srcDir,
    setPageTitle: setPageTitle
};