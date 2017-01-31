'use strict';

var fs = require('fs');
var path = require('path');

var config = require('./config');

function copyFile(src, dest) {

    var readStream = fs.createReadStream(src);

    readStream.once('error', function (err) {
        console.log(err);
    }),
    readStream.once('end', function () {
        console.log('Copy has been completed');
    })
    .pipe(fs.createWriteStream(dest));
}

fs.access(path.resolve(__dirname, '..'), function (err) {
    if (err) console.error;
    copyFile(__dirname + '/base/_config.json', path.join(path.resolve(__dirname, '..'), '_config.json'));
});

function copyFolder(src, dest) {

    var files = [];
    var targetFolder = path.join(dest, path.basename(src));

    if (!fs.exists(targetFolder, function (err) { 
        if (err) console.error(err) 
    })){
        fs.mkdir(targetFolder, function(err) {
            if (err) console.error(err);
        });
    }
    
    if (fs.lstatSync(src).isDirectory()) {
        files = fs.readdirSync(src);

        files.forEach(function (file) {
            var currentSource = path.join(src, file);

            if (fs.lstatSync(currentSource).isDirectory()) {
                copyFolder(currentSource, targetFolder);
            } else {
                copyFile(currentSource, targetFolder);
            }
        });
    }
}

function newSite() { 
    copyFolder(__dirname + '/base/_pages/', path.resolve(__dirname, '..'));
}

module.exports = newSite;