'use strict';

var argv = require('yargs').argv;
var gulp = require('gulp');

var tasks = require('./index');

gulp.task('post', function () {
    var title = argv.title || argv.t;
    tasks.post(title);
});

gulp.task('page', function () {
    var title = argv.title || argv.t;
    var slug =  argv.slug || argv.s;
    
    tasks.page(title, slug);
});

gulp.task('build', function () {
    tasks.build();
});

gulp.task('new', function() {
    tasks.new();
});

gulp.task('default', function () {
    console.log('default task');
});