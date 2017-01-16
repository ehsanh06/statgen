'use strict';

var gulp = require('gulp');
var tasks = require('./lib/');

gulp.task('post', function () {
    var title = 'another test example';
    tasks.post(title);
});

gulp.task('page', function () {
    var title = 'Page title example';
    var slug = 'post-title-example';
    tasks.page(title, slug);
});

gulp.task('build', function () {
    tasks.build();
});

gulp.task('default', function () {
    console.log('default tasks');
});