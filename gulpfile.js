// Include Gulp, plugins and local files
var _ = require('underscore');
var argv = require('yargs').argv;
var fm = require('front-matter');
var fs = require('fs');
var gulp = require('gulp');
var handlebars = require('handlebars');
var marked = require('marked');
var mkdirp = require('mkdirp');
var moment = require('moment');
var rename = require('gulp-rename');
var rmrf = require('rimraf');
var sass = require('gulp-sass');

var config = require('./config.json');
var global = require('./lib/global');

gulp.task('post', require('./tasks/post/post.js')(gulp));
gulp.task('page', require('./tasks/page/page.js')(gulp));