'use strict';
// Include Gulp, plugins and local files
var argv = require('yargs').argv;
var fs = require('fs');
var gulp = require('gulp');
var mkdirp = require('mkdirp');
var moment = require('moment');

var utils = require('./utils');
var build = require('./build');

var t = title || null;
var s = slug || null;

function page(title) {
    console.log('Console Message: Building Page');

    // If the output is either -t or --title  then we store this to title
    if (title) {

        var title = argv.title || argv.t;
        var slug = (argv.slug || argv.s) ? build.hyphenateString(argv.slug || argv.s) : build.hyphenateString(title.toString());
        
        // Filename has the value of the file path of the page in question
        var filename = build.srcDir.pages + slug + '.md';

        // fs.access determines if a file exists, regardless of rwx permissions
        fs.access(filename, fs.F_OK, function (err) {

            // Since this exists, then we can log to the console that this file(in question) exists
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
                ' <Insert your content here> \r\n ';          // Content goes here CR/NL regex

            // We're creating a directory corresponding to the paths.page string (filepath).             
            mkdirp(build.srcDir.pages, function (err) {

                // If error, return error.
                if (err) {
                    return err;
                }

                // FileSystem will now write the file according to filename/meta
                fs.writeFile(filename, meta, function (err) {

                    // Error handler
                    if (err) {
                        return err;
                    }

                    // Log to the console the success of the page generated
                    console.log('Task success - Your new page was successfully created: ', filename);
                });
            });
        });

    } else {

        // Otherwise we log the error out to console if user didn't input -t or --title
        return 'Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"';
    }

}


module.exports = page;