'use strict';

// Include Gulp, plugins and local files
var argv = require('yargs').argv;
var fs = require('fs');
var gulp = require('gulp');
var mkdirp = require('mkdirp');
var moment = require('moment');

var global = require('../../lib/global');

module.exports = function () {

    gulp.task('post', function () {

        // Checking if  the CLI output is --title or -t
        if (argv.title || argv.t) {

            var title = argv.title || argv.t;
            var path = (argv.d || argv.default) ? global.srcDir.drafts : global.srcDir.posts;
            var slug = global.hyphenateSlug(title);

            // Filename has the value of the file path of the page in question
            var filename = path + moment().format('DD-MM-YY') + '-' + slug + '.md';

            // fs.access determines if a file exists, regardless of rwx permissions
            fs.access(filename, fs.constants.F_OK, function (err) {

                // Since this exists, then we can log to the console that this file(in question) exists
                if (err) { return 'Task aborted: File ' + filename + ' already exists.'; }

                var meta =
                    '---\r\n' +                                         // --- CR/NL regex
                    'date: ' + moment().format() + '\r\n' +             // Date format, CR/NL regex
                    'layout: post\r\n' +                                // Layout: page CR/NLregex
                    'slug: ' + slug + '\r\n' +                          // slug variable, CR/NL regex
                    'tags: []\r\n' +                                    // Tags, if applicable CR/NL regex
                    'title: "' + title + '"\r\n' +                      // Title of the page CR/NL regex
                    '---\r\n' +                                         // --- CR/NL regex
                    ' <Insert your content here> \r\n ';                // Content goes here CR/NL regex

                // We're creating a directory corresponding to the pages directory string (filepath).             
                mkdirp(path, function (err) {

                    // If error, return error.
                    if (err) { return err; }

                    // FileSystem will now write the file according to filename/meta
                    fs.writeFileSync(filename, meta, function (err) {

                        // Error handler
                        if (err) { return err; }

                        // Log to the console the success of the page generated
                        console.log('Task success - Your new post was successfully created: ', filename);
                    });
                });
            });

        } else {

            // Otherwise we log the error out to console if user didn't input -t or --title
            return 'Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"';
        }
    });
};