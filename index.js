#!/usr/bin/env node

'use strict';

const program = require('commander');

const newSite = require('./lib/new');
const post = require('./lib/post');
const page = require('./lib/page');
const build = require('./lib/build');

program.version('0.1.0');

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
    
program.command('new')
    .description('creates new statgen project')
    .action(function() {
        newSite();
    });

program.parse(process.argv);