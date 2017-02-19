'use strict';

var fs = require('fs');
var path = require('path');
var config = require('./config');
var utils = require('./utils');

function copySrcDirectories() {
    var files = fs.readdirSync(utils.paths.src);
    files.forEach(function (file) {
        utils.paths.src = '/lib/src/';
        var filePath = path.resolve(process.cwd() + utils.paths.src + file);
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
        utils.copyFile(path.resolve(src + '/' + file), path.resolve(dest + '/' + file));
    });
}

function newSite() {
    var configSrc = utils.paths.src + utils.paths.config;
    var configDest = path.resolve(process.cwd() + '/' + utils.paths.config);

    utils.copyFile(configSrc, configDest);
    copySrcDirectories();
}

module.exports = newSite;