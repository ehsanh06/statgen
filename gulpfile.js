'use strict';

var argv = require('yargs').argv;
var gulp = require('gulp');

var tasks = require('./lib/');

gulp.task('post', function () {
    var argTitle = argv.title || argv.t;
    var title = (argTitle) ? argTitle : undefined;

    tasks.post(title);
});

gulp.task('page', function () {
    var argTitle = argv.title || argv.t;
    var argSlug = argv.slug || argv.s;
    var slug =  (argSlug) ? argSlug : undefined;
    var title = (argTitle) ? argTitle : undefined;

    tasks.page(title, slug);
});

gulp.task('build', function () {
    tasks.build();
});

gulp.task('default', function () {
    console.log('default tasks');
});