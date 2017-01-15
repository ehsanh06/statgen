'use strict';

var _ = require('underscore');
var fm = require('front-matter');
var fs = require('fs');
var handlebars = require('handlebars');
var marked = require('marked');
var moment = require('moment');

var config = require('./config.json');
var utils = require('./utils');

var siteData = {
    posts: [],
    pages: [],
    archive: [],
    tags: [],
    navigation: []
};

function build() {
    readMarkdownFiles();
    createAuxData();
    createAllPages();

};

function readMarkdownFiles() {

    if (utils.directoryExists(config.posts)) {
        fs.readdirSync(config.posts).forEach(function(file) {
            if (file.split('.')[1] !== 'md') {
                return this;
            }

            var data = fm(fs.readFileSync(config.posts + file, 'utf8'));
            var post = data.attributes;

            post.year = moment(post.date).format('YYYY');
            post.Date = moment(post.date).format('MMM YYYY');
            post.shortDate = moment(post.date).format('DD MM');
            post.content = marked(data.body);

            _.each(post.tags, function(tag) {
                siteData.tags.push({
                    tag: tag,
                    post: post
                });
            });
            siteData.posts.push(post);
        });
    }
    if (utils.directoryExists(config.pages)) {
        fs.readdirSync(config.pages).forEach(function(file) {
            if (file.split('.')[1] !== 'md') {
                return;
            }
            var data = fm(fs.readFileSync(config.pages + file, 'utf8'));
            var page = data.attributes;

            page.content = marked(data.body);
            siteData.pages.push(page);
        });
    }
}

function createAuxData() {
    siteData.posts = _.sortBy(siteData.posts, 'date').reverse();
    siteData.recentPosts = siteData.posts.slice(0, config.recentPostLimit);

    var postsByTag = _.groupBy(siteData.tags, 'tag');
    siteData.tags = [];

    _.mapObject(postsByTag, function(val, key) {
        siteData.tags.push({
            name: key,
            posts: val
        });
    });

    var postsByYear = _.groupBy(siteData.posts, 'year');

    _.mapObject(postsByYear, function(val, key) {
        siteData.archive.push({
            year: key,
            posts: val
        });
    });

    siteData.archive.reverse();
    _.each(siteData.pages, function(page) {
        if (page.navigation) {
            siteData.navigation.push({
                slug: page.slug,
                title: page.navigationTitle,
                url: (page.slug === 'home') ? '/' : '/' + page.slug + '/',
                active: false,
                order: page.order
            });
        }
    });
    siteData.navigation = _.sortBy(siteData.navigation, 'order');
}

function createAllPages() {

    _.each(siteData.pages, function(page) {
        var pageData = {
            page: page,
            navigation: siteData.navigation,
            recentPosts: siteData.recentPosts,
            archive: siteData.archive,
            config: config
        };

        _.each(siteData.navigation, function(item) {
            item.active = (item.slug == page.slug) ? true : false;
        });

        if (page.slug === 'home') {
            var path = config.dist;
            pageData.pageTitle = setPageTitle(config.siteTitle);
            pageData.showRecent = true;
            pageData.isHome = true;
        } else {
            var path = config.dist + page.slug + '/';
            pageData.pageTitle = setPageTitle(page.navigationTitle);
        }

        createPage({
            layout: page.layout,
            path: path,
            pageData: pageData
        });
    });

    _.each(siteData.posts, function(post) {
        var pageData = {
            post: post,
            navigation: siteData.navigation,
            pageTitle: setPageTitle(post.title),
            recentPosts: siteData.recentPosts,
            config: config
        };

        _.forEach(siteData.navigation, function(item) {
            item.active = false;
        });

        createPage({
            layout: post.layout,
            path: config.dist + post.year + '/' + post.slug + '/',
            pageData: pageData
        });
    });

    _.each(siteData.tags, function(tag) {
        var pageData = {
            tag: tag,
            navigation: siteData.navigation,
            pageTitle: setPageTitle('Tag: ' + tag.name),
            recentPosts: siteData.recentPosts,
            config: config
        };

        createPage({
            layout: 'tag',
            path: config.dist + '/tag/' + tag.name + '/',
            pageData: pageData
        });
    });

    var setPageTitle = function(title) {
        return title + ' - ' + srcDir.author;
    };

    var createPage = function(data) {
        var html = template(data.pageData);
        var layout = fs.readFile(config.layouts + data.layout + '.html', 'utf-8');
        var template = handlebars.compile(layout);

        mkdirp(data.path, function(err) {
            if (err) return console.log(err);

            fs.writeFileSync(data.path + 'index.html', html, function(err) {
                if (err) return err;
            });
        });
    }
}

module.exports = build;