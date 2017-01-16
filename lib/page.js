'use strict';

var argv = require('yargs').argv;
var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');

var config = require('./config.json');
var utils = require('./utils');

function page(title) {
    console.log('\n' + 'Console Message: Building Page' + '\n');
  
        var slug = utils.hyphenateString(title);
        var filename = config.path.pages + slug + '.md';
        fs.access(filename, fs.F_OK, function (err) {
            if (!err) {
                return console.log('\n' + 'Task aborted: File ' + filename + ' already exists.');
            }
            var meta =
                '---\r\n' +
                'date: ' + moment().format() + '\r\n' +
                'layout: page\r\n' +
                'order: 0\r\n' +
                'navigation: false\r\n' +
                'navigationTitle: "' + title + '"\r\n' +
                'title: "' + title + '"\r\n' +
                'slug: ' + slug + '\r\n' +
                '---\r\n' +
                ' <Insert your content here> \r\n ';

            mkdirp(config.path.pages, function (err) {
                if (err) return err;
                fs.writeFile(filename, meta, function (err) {
                    if (err) return err;
                    return console.log('Task success - Your new page was successfully created: ', filename);
                });
            });
        });
    
}

module.exports = page;