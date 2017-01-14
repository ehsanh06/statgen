'use strict';

var _ = require('underscore');
var fm = require('front-matter');
var fs = require('fs');
var handlebars = require('handlebars');
var marked = require('marked');
var moment = require('moment');

var config = require('../../config.json');
var utils = require('./utils');

// Define Base folders 
var srcDir = {
    pages: '../../views/pages/',
    posts: '../../views/posts/',
    drafts: '../../views/drafts/',
    layouts: '../../views/layouts/',
    includes: '../../public/src/js/',
    sass: '../../public/src/sass/*.scss',
    dist: '../../dist/',
    distCss: '../../dist/css/'
};

// siteData will hold the meta information for the site
var siteData = {
    posts: [],
    pages: [],
    archive: [],
    tags: [],
    navigation: []
};

function build() {

    function readMarkdownFiles() {

        // Validating if the directory does exist
        if (utils.dirExists(srcDir.posts)) {

            // FileSystem will read the dir for posts and loop through each file
            fs.readdirSync(srcDir.posts).forEach(function (file) {

                if (file.split('.')[1] !== 'md') {
                    return this;
                }

                // Add meta-data to content via fm for the the posts method and it's corresponding
                // file using the UTF-8 format
                var data = fm(fs.readFileSync(srcDir.posts + file, 'utf8'));
                var post = data.attributes;

                // Date formatting
                post.year = moment(post.date).format('YYYY');
                post.Date = moment(post.date).format('MMM YYYY');
                post.shortDate = moment(post.date).format('DD MM');

                // post.content is marked to the DOM Body Object
                post.content = marked(data.body);

                // Pushing tags to the siteData.tags array
                _.each(post.tags, function (tag) {
                    siteData.tags.push({
                        tag: tag,
                        post: post
                    });
                });

                // Pushing posts to the siteData.posts array
                siteData.posts.push(post);
            });
        }

        // Validating if the directory does exist
        if (utils.dirExists(srcDir.pages)) {

            // FileSystem will read the dir for pages and loop through each file
            fs.readdirSync(srcDir.pages).forEach(function (file) {

                // Return, if after the . split is not equal to the MD file extension 
                if (file.split('.')[1] !== 'md') {
                    return this;
                }
                // Add meta-data to content via fm for the the pages method and it's corresponding
                // file using the UTF-8 format
                var data = fm(fs.readFileSync(srcDir.pages + file, 'utf8'));
                var page = data.attributes;

                // page.content is marked to the DOM Body Object
                page.content = marked(data.body);

                // We'll then add all this to the siteData.pages empty array
                siteData.pages.push(page);
            });
        }
    }

    function createAuxData() {

        // Sort articles in decending order
        siteData.posts = _.sortBy(siteData.posts, 'date').reverse();

        // Get latest articles and store this to siteData.recentPosts 
        siteData.recentPosts = siteData.posts.slice(0, config.recentPostLimit);

        // Create tags
        var postsByTag = _.groupBy(siteData.tags, 'tag');
        siteData.tags = [];
        _.mapObject(postsByTag, function (val, key) {
            siteData.tags.push({
                name: key,
                posts: val
            });
        });

        //  Create archive by year
        var postsByYear = _.groupBy(siteData.posts, 'year');
        _.mapObject(postsByYear, function (val, key) {
            siteData.archive.push({
                year: key,
                posts: val
            });
        });
        siteData.archive.reverse();

        //  Create navigation
        _.each(siteData.pages, function (page) {

            // If there is navigation on page
            if (page.navigation) {

                // Push the following Object into siteData navigation Object array
                siteData.navigation.push({
                    slug: page.slug,
                    title: page.navigationTitle,
                    url: (page.slug === 'home') ? '/' : '/' + page.slug + '/',
                    active: false,
                    order: page.order
                });
            }
        });

        // Sort the Navigation by order
        siteData.navigation = _.sortBy(siteData.navigation, 'order');
    }


    function createAllPages() {

        // Looping through siteData.pages with callback
        _.each(siteData.pages, function (page) {

            var pageData = {
                page: page,
                navigation: siteData.navigation,
                recentPosts: siteData.recentPosts,
                archive: siteData.archive,
                config: config
            };

            _.each(siteData.navigation, function (item) {
                item.active = (item.slug == page.slug) ? true : false;
            });

            if (page.slug === 'home') {
                var path = srcDir.dist;
                pageData.pageTitle = setPageTitle(config.siteTitle);
                pageData.showRecent = true;
                pageData.isHome = true;
            } else {
                var path = srcDir.dist + page.slug + '/';
                pageData.pageTitle = setPageTitle(page.navigationTitle);
            }

            createPage({
                layout: page.layout,
                path: path,
                pageData: pageData
            });
        });

        _.each(siteData.posts, function (post) {
            var pageData = {
                post: post,
                navigation: siteData.navigation,
                pageTitle: setPageTitle(post.title),
                recentPosts: siteData.recentPosts,
                config: config
            };

            // Resetting navigation active state
            _.forEach(siteData.navigation, function (item) {
                item.active = false;
            });

            createPage({
                layout: post.layout,
                path: srcDir.dist + post.year + '/' + post.slug + '/',
                pageData: pageData
            });
        });

        _.each(siteData.tags, function (tag) {
            var pageData = {
                tag: tag,
                navigation: siteData.navigation,
                pageTitle: setPageTitle('Tag: ' + tag.name),
                recentPosts: siteData.recentPosts,
                config: config
            };

            createPage({
                layout: 'tag',
                path: srcDir.dist + '/tag/' + tag.name + '/',
                pageData: pageData
            });
        });
        
        // Setting the page title
        var setPageTitle = function (title) { return title + ' - ' + srcDir.author; };

        var createPage = function (data) {
            var html = template(data.pageData);
            var layout = fs.readFile(srcDir.layouts + data.layout + '.html', 'utf-8');
            var template = handlebars.compile(layout);

            // Create a directory relative to data.path
            mkdirp(data.path, function (err) {
                if (err) {
                    return console.log(err);
                }

                // Write to the path of index in html format
                fs.writeFileSync(data.path + 'index.html', html, function (err) {
                    if (err) {
                        return err;
                    }
                });
            });
        }
    }

    readMarkdownFiles();
    createAuxData();
    createAllPages();

};

module.exports = {
    srcDir: srcDir,
    siteData: siteData,
    build: build
}