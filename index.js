#!/usr/bin/env node

'use strict';

var program = require('commander');

var init = require('./lib/init');
var newSite = require('./lib/new');
var post = require('./lib/post');
var page = require('./lib/page');
var build = require('./lib/build');

function pageFunc() {
    console.log('hwhrwrhwrhwrhwrwrwrwrwe...');
}

program.version('0.0.1');

    // .command('init')
    // .description('creates config file in current directory')
    // .action(function() {
    //     init();
    // })

    // .command('new')
    // .description('creates new statgen project')
    // .action(function() {
    //     newSite();
    // })

// program.option('-t, --title <title>', 'title for page')
//     .option('-s, --slug [slug]', 'slug for page')

program.command('page')
    .description('creates new page')
    .option('-t, --title <title>', 'title for page')
    .option('-s, --slug [slug]', 'slug for page')
    .action(function(program) {
        page(program.title, program.slug);
    });

program.command('post')
    .description('creates new post')
    .option('-t, --title <title>', 'title for page')
    .action(function(program) {
        post(program.title);
    });

program.command('build')
    .description('build site')
    .action(function() {
        build();
    });
    
program.parse(process.argv);