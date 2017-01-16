'use strict';

var gulp = require('gulp');
var tasks = require('./lib/');

gulp.task('post', function() {
    var title = 'Post title example';
    var slug = 'post-title-example';

    // With default parameters in ES2015, the check in the function body is no longer necessary
    // Slug is an optional parameter
    tasks.post(title, slug);
});

gulp.task('page', function() {
    var title = 'Page title example';
    tasks.page(title);
});

gulp.task('build', function() {
    tasks.build();
});

gulp.task('default', function(){
    console.log('default tasks');
});