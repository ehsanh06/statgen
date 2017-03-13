'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const config = require('./config');
const utils = require('./utils');

module.exports = (title, _slug) => {
    if (title == null || title == undefined || title == '') {
        return console.log('Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"');
    }

    const slug = (_slug == null || _slug == '') ? utils.hyphenateString(title) : utils.hyphenateString(_slug);
    const filename = config().paths.pages + '/' + slug + '.md';

    fs.access(filename, fs.F_OK, function (err) {
        if (!err) {
            return console.log(`Error: File '${ filename }' already exists.`);
        }

        const metaData = `---\r\n
            date: ${ moment().format() }\r\n
            layout: page\r\n
            order: 0\r\n
            navigation: true\r\n
            navigationTitle: "${ title }"\r\n
            slug: ${ slug }\r\n
            title: "${ title }"\r\n
            ---\r\n
            Insert your content here \r\n`;

        mkdirp(config().paths.pages, function (err) {
            if (err) return err;
            fs.writeFile(filename, metaData, function (err) {
                if (err) return err;
                return console.log('Created:', filename);
            });
        });
    });
}