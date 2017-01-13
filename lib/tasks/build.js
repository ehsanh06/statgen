'use strict';

// Include Gulp, plugins and local files
var _ = require('underscore');
var fm = require('front-matter');
var fs = require('fs');
var marked = require('marked');
var moment = require('moment');

var config = require('../../../config.json');
var utils = require('../utils');

function build() {

        // calling build method from statgen - this logs Statgen: Build1
        utils.build();

        function readMarkdownFiles() {

            // Validating if the directory does exist
            if (utils.dirExists(utils.srcDir.posts)) {

                // FileSystem will read the dir for posts and loop through each file
                fs.readdirSync(utils.srcDir.posts).forEach(function (file) {

                    if (file.split('.')[1] !== 'md') { 
                        return this; 
                    }

                    // Add meta-data to content via fm for the the posts method and it's corresponding
                    // file using the UTF-8 format
                    var data = fm(fs.readFileSync(utils.srcDir.posts + file, 'utf8'));
                    var post = data.attributes;

                    // Date formatting
                    post.year = moment(post.date).format('YYYY');
                    post.Date = moment(post.date).format('MMM YYYY');
                    post.shortDate = moment(post.date).format('DD MM');

                    // post.content is marked to the DOM Body Object
                    post.content = marked(data.body);

                    // Pushing tags to the siteData.tags array
                    _.each(post.tags, function (tag) {
                        utils.siteData.tags.push({
                            tag: tag,
                            post: post
                        });
                    });

                    // Pushing posts to the siteData.posts array
                    utils.siteData.posts.push(post);
                });
            }

            // Validating if the directory does exist
            if (utils.dirExists(utils.srcDir.pages)) {

                // FileSystem will read the dir for pages and loop through each file
                fs.readdirSync(utils.srcDir.pages).forEach(function (file) {

                    // Return, if after the . split is not equal to the MD file extension 
                    if (file.split('.')[1] !== 'md') { 
                        return this;
                    }
                    // Add meta-data to content via fm for the the pages method and it's corresponding
                    // file using the UTF-8 format
                    var data = fm(fs.readFileSync(utils.srcDir.pages + file, 'utf8'));
                    var page = data.attributes;

                    // page.content is marked to the DOM Body Object
                    page.content = marked(data.body);

                    // We'll then add all this to the siteData.pages empty array
                    utils.siteData.pages.push(page);
                });
            }
        }

        function createAuxData() {

            // Sort articles in decending order
            utils.siteData.posts = _.sortBy(utils.siteData.posts, 'date').reverse();

            // Get latest articles and store this to siteData.recentPosts 
            utils.siteData.recentPosts = utils.siteData.posts.slice(0, config.recentPostLimit);

            // Create tags
            var postsByTag = _.groupBy(utils.siteData.tags, 'tag');
            utils.siteData.tags = [];
            _.mapObject(postsByTag, function (val, key) {
                utils.siteData.tags.push({
                    name: key,
                    posts: val
                });
            });

            //  Create archive by year
            var postsByYear = _.groupBy(utils.siteData.posts, 'year');
            _.mapObject(postsByYear, function (val, key) {
                utils.siteData.archive.push({
                    year: key,
                    posts: val
                });
            });
            utils.siteData.archive.reverse();

            //  Create navigation
            _.each(utils.siteData.pages, function (page) {

                // If there is navigation on page
                if (page.navigation) {

                    // Push the following Object into siteData navigation Object array
                    utils.siteData.navigation.push({
                        slug: page.slug,
                        title: page.navigationTitle,
                        url: (page.slug === 'home') ? '/' : '/' + page.slug + '/',
                        active: false,
                        order: page.order
                    });
                }
            });

            // Sort the Navigation by order
            utils.siteData.navigation = _.sortBy(utils.siteData.navigation, 'order');
        }


        function createAllPages() {

            // Looping through siteData.pages with callback
            _.each(utils.siteData.pages, function (page) {

                var pageData = {
                    page: page,
                    navigation: utils.siteData.navigation,
                    recentPosts: utils.siteData.recentPosts,
                    archive: utils.siteData.archive,
                    config: config
                };

                _.each(utils.siteData.navigation, function (item) {
                    item.active = (item.slug == page.slug) ? true : false;
                });

                if (page.slug === 'home') {
                    var path = utils.srcDir.dist;
                    pageData.pageTitle = utils.setPageTitle(config.siteTitle);
                    pageData.showRecent = true;
                    pageData.isHome = true;
                } else {
                    var path = utils.srcDir.dist + page.slug + '/';
                    pageData.pageTitle = utils.setPageTitle(page.navigationTitle);
                }

                utils.createPage({
                    layout: page.layout,
                    path: path,
                    pageData: pageData
                });
            });

            _.each(utils.siteData.posts, function (post) {
                var pageData = {
                    post: post,
                    navigation: utils.siteData.navigation,
                    pageTitle: utils.setPageTitle(post.title),
                    recentPosts: utils.siteData.recentPosts,
                    config: config
                };

                // Resetting navigation active state
                _.forEach(utils.siteData.navigation, function (item) {
                    item.active = false;
                });

                utils.createPage({
                    layout: post.layout,
                    path: utils.srcDir.dist + post.year + '/' + post.slug + '/',
                    pageData: pageData
                });
            });

            _.each(siteData.tags, function (tag) {
                var pageData = {
                    tag: tag,
                    navigation: utils.siteData.navigation,
                    pageTitle: utils.setPageTitle('Tag: ' + tag.name),
                    recentPosts: utils.siteData.recentPosts,
                    config: config
                };

                utils.createPage({
                    layout: 'tag',
                    path: utils.srcDir.dist + '/tag/' + tag.name + '/',
                    pageData: pageData
                });
            });

        }

        readMarkdownFiles();
        createAuxData();
        createAllPages();

    };

module.exports = {
    build: build
}