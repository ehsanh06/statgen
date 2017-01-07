// Include Gulp and Plugins
var _          = require('underscore');
var argv       = require('yargs').argv;
var colors     = require('colors');
var fm         = require('front-matter');
var fs         = require('fs');
var gulp       = require('gulp');
var gzip       = require('gulp-gzip');
var handlebars = require('handlebars');
var marked     = require('marked');
var mkdirp     = require('mkdirp');
var moment     = require('moment');
var rename     = require('gulp-rename');
var requireDir = require('require-dir');
var rmrf       = require('rimraf');
var sass       = require('gulp-sass');
var s3         = require('gulp-s3');

var conf       = require('./conf.json');
var dir        = requireDir('./tasks/');

// Define base folders
var paths = {
    pages: './views/pages/',
    posts: './views/posts/',
    drafts: './views/drafts/',
    layouts: './views/',
    // includes: './includes/',             Come back to this
    sass: './src/sass/**/*.scss',
    dist: './dist/',
    distCss: './dist/css/'
}