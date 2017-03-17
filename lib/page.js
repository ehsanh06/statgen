'use strict';

const fs = require('fs');
const moment = require('moment');
const config = require('./config');
const utils = require('./utils');

module.exports = (title, _slug) => {

    if (title == null || title == undefined || title == '') {
        return console.log('Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"');
    }

    const slug = (_slug == null || _slug == undefined || _slug == '') ? utils.hyphenateString(title) : utils.hyphenateString(_slug);
    const filename = config().paths.pages + '/' + slug + '.md';

    fs.access(filename, fs.F_OK, function (err) {
        if (!err) return console.log(`Error: File '${ filename }' already exists.`);

        const metaData = `---
date: ${ moment().format() }
layout: page
order: 0
navigation: true
navigationTitle: "${ title }"
slug: ${ slug }
title: "${ title }"
---
Insert your content here`;

        utils.createFileWithPath(filename, metaData).then((file) => {
            console.log('Statgen: Created', file);
        });

    });
}