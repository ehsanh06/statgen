'use strict';

const fs = require('fs');
const moment = require('moment');
const config = require('./config');
const utils = require('./utils');

module.exports = (title) => {
    if (title == null || title == undefined || title == '') {
        return console.log('Error: You must enter a title for your post. Use --title "Page title" or -t "Page title"');
    }

    const slug = utils.hyphenateString(title);
    const filename = config().paths.posts + '/' + moment().format('DD-MM-YY') + `-${ slug }.md`;

    fs.access(filename, fs.constants.F_OK, function (err) {
        if (!err) return console.log(`Error: File '${ filename }' already exists.`);

        const metaData = `---
date: ${ moment().format() }
layout: post
slug: ${ slug }
tags: []
title: "${ title }"
---
Insert your content here`;

        utils.createFileWithPath(filename, metaData).then((file) => {
            console.log('Created:', file);
        });
    });
}