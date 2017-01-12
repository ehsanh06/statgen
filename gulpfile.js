// Include Gulp and modular task file
var gulp = require('gulp');
var tasks = require('./lib/tasks/index');

// Gulp tasks
gulp.task('post', function() {
    console.log('Console Message: Building Post'),
    tasks.post;
});
gulp.task('page', function() {
    console.log('Console Message: Building Page'),
    tasks.page;
});
gulp.task('build', function() {
    console.log('Console Message: Building in progress'),
    tasks.build;
});
// Default task goes here