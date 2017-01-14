'use strict';

var argv = require('yargs').argv;
var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');

var config = require('./config.json');
var utils = require('./utils');

var title, slug = "Page title example";

function page(title) {
    console.log('Console Message: Building Page');
    if (title) {
        var filename = config.pages + slug + '.md';
        fs.access(filename, fs.F_OK, function(err) {
            if (err) {
                return 'Task aborted: File ' + filename + ' already exists.';
            }
            var meta =
                '---\r\n' +                                 // --- CR/NL regex
                'date: ' + moment().format() + '\r\n' +     // Date format, CR/NL regex
                'layout: page\r\n' +                        // Layout: page CR/NLregex
                'order: 0\r\n' +                            // Order of the page CR/NL regex
                'navigation: false\r\n' +                   // Navigation set to false, CR/NL regex
                'navigationTitle: "' + title + '"\r\n' +    // NavTitle, title variable CR/NL regex
                'title: "' + title + '"\r\n' +              // Title of the page CR/NL regex
                'slug: ' + slug + '\r\n' +                  // slug variable, CR/NL regex
                '---\r\n' +                                 // --- CR/NL regex
                ' <Insert your content here> \r\n ';        // Content goes here CR/NL regex

            mkdirp(config.pages, function(err) {
                if (err) return err;

                fs.writeFile(filename, meta, function(err) {
                    if (err) return err;
                    console.log('Task success - Your new page was successfully created: ', filename);
                });
            });
        });
    } else {
        return 'Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"';
    }
}

module.exports = page;