'use strict';

// Include Gulp, plugins and local files
var _ = require('underscore');
var fm = require('front-matter');
var fs = require('fs');
var gulp = require('gulp');
var marked = require('marked');
var mkdirp = require('mkdirp');
var moment = require('moment');

var config = require('../../config.json');
var global = require('../../lib/global');

module.exports = function () {

    // Task which takes care of the actual site build itself
    gulp.task('build', function () {

        // calling build method from statgen - this logs Statgen: Build1
        global.build();

        function readMarkdownFiles() {

            // Validating if the directory does exist
            if (global.dirExists(global.srcDir.posts)) {

                // FileSystem will read the dir for posts and loop through each file
                fs.readdirSync(global.srcDir.posts).forEach(function (file) {

                    if (file.split('.')[1] !== 'md') { 
                        return this; 
                    }

                    // Add meta-data to content via fm for the the posts method and it's corresponding
                    // file using the UTF-8 format
                    var data = fm(fs.readFileSync(global.srcDir.posts + file, 'utf8'));
                    var post = data.attributes;

                    // Date formatting
                    post.year = moment(post.date).format('YYYY');
                    post.Date = moment(post.date).format('MMM YYYY');
                    post.shortDate = moment(post.date).format('DD MM');

                    // post.content is marked to the DOM Body Object
                    post.content = marked(data.body);

                    // Pushing tags to the siteData.tags array
                    _.each(post.tags, function (tag) {
                        global.siteData.tags.push({
                            tag: tag,
                            post: post
                        });
                    });

                    // Pushing posts to the siteData.posts array
                    global.siteData.posts.push(post);
                });
            }

            // Validating if the directory does exist
            if (global.dirExists(global.srcDir.pages)) {

                // FileSystem will read the dir for pages and loop through each file
                fs.readdirSync(global.srcDir.pages).forEach(function (file) {

                    // Return, if after the . split is not equal to the MD file extension 
                    if (file.split('.')[1] !== 'md') { 
                        return this;
                    }
                    // Add meta-data to content via fm for the the pages method and it's corresponding
                    // file using the UTF-8 format
                    var data = fm(fs.readFileSync(global.srcDir.pages + file, 'utf8'));
                    var page = data.attributes;

                    // page.content is marked to the DOM Body Object
                    page.content = marked(data.body);

                    // We'll then add all this to the siteData.pages empty array
                    global.siteData.pages.push(page);
                });
            }
        }

        function createAuxData() {

            // Sort articles in decending order
            global.siteData.posts = _.sortBy(global.siteData.posts, 'date').reverse();

            // Get latest articles and store this to siteData.recentPosts 
            global.siteData.recentPosts = global.siteData.posts.slice(0, config.recentPostLimit);

            // Create tags
            var postsByTag = _.groupBy(global.siteData.tags, 'tag');
            global.siteData.tags = [];
            _.mapObject(postsByTag, function (val, key) {
                global.siteData.tags.push({
                    name: key,
                    posts: val
                });
            });

            //  Create archive by year
            var postsByYear = _.groupBy(global.siteData.posts, 'year');
            _.mapObject(postsByYear, function (val, key) {
                global.siteData.archive.push({
                    year: key,
                    posts: val
                });
            });
            global.siteData.archive.reverse();

            //  Create navigation
            _.each(global.siteData.pages, function (page) {

                // If there is navigation on page
                if (page.navigation) {

                    // Push the following Object into siteData navigation Object array
                    global.siteData.navigation.push({
                        slug: page.slug,
                        title: page.navigationTitle,
                        url: (page.slug === 'home') ? '/' : '/' + page.slug + '/',
                        active: false,
                        order: page.order
                    });
                }
            });

            // Sort the Navigation by order
            global.siteData.navigation = _.sortBy(global.siteData.navigation, 'order');
        }


        function createAllPages() {

            // Looping through siteData.pages with callback
            _.each(global.siteData.pages, function (page) {

                var pageData = {
                    page: page,
                    navigation: global.siteData.navigation,
                    recentPosts: global.siteData.recentPosts,
                    archive: global.siteData.archive,
                    config: config
                };

                _.each(global.siteData.navigation, function (item) {
                    item.active = (item.slug == page.slug) ? true : false;
                });

                if (page.slug === 'home') {
                    var path = global.srcDir.dist;
                    pageData.pageTitle = global.setPageTitle(config.siteTitle);
                    pageData.showRecent = true;
                    pageData.isHome = true;
                } else {
                    var path = global.srcDir.dist + page.slug + '/';
                    pageData.pageTitle = global.setPageTitle(page.navigationTitle);
                }

                global.createPage({
                    layout: page.layout,
                    path: path,
                    pageData: pageData
                });
            });

            _.each(global.siteData.posts, function (post) {
                var pageData = {
                    post: post,
                    navigation: global.siteData.navigation,
                    pageTitle: global.setPageTitle(post.title),
                    recentPosts: global.siteData.recentPosts,
                    config: config
                };

                // Resetting navigation active state
                _.forEach(global.siteData.navigation, function (item) {
                    item.active = false;
                });

                global.createPage({
                    layout: post.layout,
                    path: global.srcDir.dist + post.year + '/' + post.slug + '/',
                    pageData: pageData
                });
            });

            _.each(siteData.tags, function (tag) {
                var pageData = {
                    tag: tag,
                    navigation: global.siteData.navigation,
                    pageTitle: global.setPageTitle('Tag: ' + tag.name),
                    recentPosts: global.siteData.recentPosts,
                    config: config
                };

                global.createPage({
                    layout: 'tag',
                    path: global.srcDir.dist + '/tag/' + tag.name + '/',
                    pageData: pageData
                });
            });

        }

        readMarkdownFiles();
        createAuxData();
        createAllPages();

    });

};