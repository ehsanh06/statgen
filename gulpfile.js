// Include Gulp and Plugins
var _           = require('underscore');
var argv        = require('yargs').argv;
var colors      = require('colors');
var fm          = require('front-matter');
var fs          = require('fs');
var gulp        = require('gulp');
var gzip        = require('gulp-gzip');
var handlebars  = require('handlebars');
var marked      = require('marked');
var mkdirp      = require('mkdirp');
var moment      = require('moment');
var rename      = require('gulp-rename');
var requireDir  = require('require-dir');
var rmrf        = require('rimraf');
var sass        = require('gulp-sass');

var conf        = require('./conf.json');
var dir         = requireDir('./tasks/');


// Define base folders
var paths = {
    pages: './views/pages/',
    posts: './views/posts/',
    drafts: './views/drafts/',
    layouts: './views/',
    includes: './public/src/js/**/*.hbs/',
    sass: './public/src/sass/**/*.scss',
    dist: './dist/',
    distCss: './dist/css/'
}

// Global variable function which takes care of slug
var hyphenateSlug = function(slug) {

    // Convert slug to lowercase, trim whitespace, replace any /'s with '-'s
    return slug.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
}

// Specifying the sass file and minified CSS file
var files = {
    input: './src/sass/style.scss',
    output: ' style.min.css'
}

// Requiring all of the external gulp-tasks
requireDir('./tasks', {recurse: true });

// Generate new page
gulp.task('new-page', ['new-page'], function(){
    console.log('New page');
});

// Generate new post
gulp.task('new-post', ['new-post'], function(){
    console.log('New post');
});


// Sass gulp task
gulp.task('sass-build', function () {
    return gulp.src(files.input)
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename(files.output))
        .pipe(gulp.dest(paths.distCss));
});

gulp.task('clean', function() { rmrf.sync(paths.dist); });

gulp.task('build', ['clean', 'site-build', 'sass-build'], function() {
   console.log(green('Task success: All pages built successfully.'));
});

gulp.task('watch:sass', function() { gulp.watch(paths.sass, ['sass-build']); });


// Default task
gulp.task('default', ['build', 'watch:sass'], function() { console.log('Default tasks'); });