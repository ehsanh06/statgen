'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');

var config = require('./config.json');

function post(title) {
    if (title === null || title === '') {
        return console.log('Error: You must enter a title for your post. Use --title "Page title" or -t "Page title"');
    }

    var slug = hyphenateSlug(title);
    var filename = config.paths.post + moment().format('DD-MM-YY') + '-' + slug + '.md';

    fs.access(filename, fs.constants.F_OK, function (err) {
        if (!err) {
            return 'Task aborted: File ' + filename + ' already exists.';
        }
        var meta =
            '---\r\n' +
            'date: ' + moment().format() + '\r\n' +
            'layout: post\r\n' +
            'slug: ' + slug + '\r\n' +
            'tags: []\r\n' +
            'title: "' + title + '"\r\n' +
            '---\r\n' +
            ' <Insert your content here> \r\n ';

        mkdirp(config.paths.post, function (err) {
            if (err) return err;
            fs.writeFile(filename, meta, function (err) {
                if (err) return err;
                console.log('Task success - Your new post was successfully created: ', filename);
            });
        });
    });
};

module.exports = post;