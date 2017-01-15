'use strict';

var argv = require('yargs').argv;
var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');

var config = require('./config.json');

function post(title, slug) {
    console.log('Console Message: Building Post');
    if (title) {

        var path = (argv.d || argv.default) ? config.path.drafts : config.path.posts;
        var filename = path + moment().format('DD-MM-YY') + '-' + slug + '.md';

        fs.access(filename, fs.constants.F_OK, function(err) {
            if (err) {
                return 'Task aborted: File ' + filename + ' already exists.';
            }
            var meta =
                '---\r\n' +                             // --- CR/NL regex
                'date: ' + moment().format() + '\r\n' + // Date format, CR/NL regex
                'layout: post\r\n' +                    // Layout: page CR/NLregex
                'slug: ' + slug + '\r\n' +              // slug variable, CR/NL regex
                'tags: []\r\n' +                        // Tags, if applicable CR/NL regex
                'title: "' + title + '"\r\n' +          // Title of the page CR/NL regex
                '---\r\n' +                             // --- CR/NL regex
                ' <Insert your content here> \r\n ';    // Content goes here CR/NL regex

            mkdirp(path, function(err) {
                if (err) return err;
                fs.writeFileSync(filename, meta, function(err) {
                    if (err) return err;
                    console.log('Task success - Your new post was successfully created: ', filename);
                });
            });
        });
    } else {
        return 'Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"';
    }
};

module.exports = post;