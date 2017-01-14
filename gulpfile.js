'use strict';

var gulp = require('gulp');
var tasks = require('./lib/tasks/');

gulp.task('post', function() {
    var title, slug = "Post title example";

    // With default parameters in ES2015, the check in the function body is no longer necessary
    // Slug is an optional parameter
    tasks.post(title, slug);
});

gulp.task('page', function() {
    var title, slug  = "Page title example";
    tasks.page(title);
});

gulp.task('build', function() {
    tasks.build();
});

gulp.task('default', function(){
    console.log('default tasks');
});