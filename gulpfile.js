'use strict';

// Include Gulp and modular task file
var gulp = require('gulp');
var tasks = require('./lib/tasks/');
var t = title || null, 
    s = slug ||  null;

// Gulp tasks
gulp.task('post', function() {

    // With default parameters in ES2015, the check in the function body is no longer necessary
    // Slug is an optional parameter
    tasks.post(title, slug);
});
gulp.task('page', function() {
    tasks.page(title);
});
gulp.task('build', function() {
    tasks.build();
});
// Default task goes here