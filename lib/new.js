'use strict';

var fs = require('fs');
var path = require('path');
var config = require('./config');

var paths = {
    src: './lib/src/',
    config: '_config.json',
};

function copySrcDirectories() {
    var files = fs.readdirSync(paths.src);
    files.forEach(function (file) {
        paths.src = '/lib/src/';
        var filePath = path.resolve(process.cwd() + paths.src + file);
        console.log(filePath);

        if (fs.statSync(filePath).isDirectory()) {
            var localRoot = path.resolve(process.cwd() + '/' + file);
            fs.mkdir(localRoot, function (err) {
                if (err) console.error;

                copyContentsFromDirectory(filePath, localRoot);
            });
        }
    });
}

function copyContentsFromDirectory(src, dest) {
    var files = fs.readdirSync(src);
    files.forEach(function (file) {
        copyFile(path.resolve(src + '/' + file), path.resolve(dest + '/' + file));
    });
}

function copyFile(src, dest) {
    var data = fs.readFileSync(src, 'utf-8');

    fs.writeFile(dest, data, function (err) {
        if (err) return err;
    });
}

function newSite() {
    var configSrc = paths.src + paths.config;
    var configDest = path.resolve(process.cwd() + '/' + paths.config);

    copyFile(configSrc, configDest);
    copySrcDirectories();
}

module.exports = {
    newSite: newSite,
    copyFile, copyFile,
    paths: paths
};