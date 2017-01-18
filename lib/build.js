'use strict';

var _ = require('underscore');
var fm = require('front-matter');
var fs = require('fs');
var handlebars = require('handlebars');
var marked = require('marked');
var moment = require('moment');

var config = require('./config.json');
var utils = require('./utils');

var setPageTitle = function (title) {
    return title + ' - ' + config.author;
};

var siteData = {
    posts: [],
    pages: [],
    archive: [],
    tags: [],
    navigation: []
};

var createPage = function (data) {
    var layout = fs.readFile(config.path.layouts + data.layout + '.html', 'utf-8');
    var template = handlebars.compile(layout);
    var html = template(data.pageData);

    mkdirp(data.path, function (err) {
        if (err) return console.log(err);

        fs.writeFileSync(data.path + 'index.html', html, function (err) {
            if (err) return err;
        });
    });
}

function build() {
    readMarkdownFiles();
    createAuxData();
    createAllPages();
};

function readMarkdownFiles() {

    if (utils.directoryExists(config.path.posts)) {
        fs.readdirSync(config.path.posts).forEach(function (file) {
            if (file.split('.')[1] !== 'md') return;

            var data = fm(fs.readFileSync(config.path.posts + file, 'utf8'));
            var post = data.attributes;

            post.year = moment(post.date).format('YYYY');
            post.Date = moment(post.date).format('MMM YYYY');
            post.shortDate = moment(post.date).format('DD MM');
            post.content = marked(data.body);

            _.each(post.tags, function (tag) {
                siteData.tags.push({
                    post: post,
                    tag: tag
                });
            });
            siteData.posts.push(post);
        });
    }
    if (utils.directoryExists(config.path.pages)) {
        fs.readdirSync(config.path.pages).forEach(function (file) {
            if (file.split('.')[1] !== 'md') return;

            var data = fm(fs.readFileSync(config.path.pages + file, 'utf8'));
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

    _.mapObject(postsByTag, function (val, key) {
        siteData.tags.push({
            name: key,
            posts: val
        });
    });

    var postsByYear = _.groupBy(siteData.posts, 'year');
    _.mapObject(postsByYear, function (val, key) {
        siteData.archive.push({
            posts: val,
            year: key
        });
    });

    siteData.archive.reverse();

    _.each(siteData.pages, function (page) {
        if (page.navigation) {
            siteData.navigation.push({
                active: false,
                order: page.order,
                slug: page.slug,
                title: page.navigationTitle,
                url: (page.slug === 'home') ? '/' : '/' + page.slug + '/'
            });
        }
    });
    siteData.navigation = _.sortBy(siteData.navigation, 'order');
}

function createAllPages() {

    _.each(siteData.pages, function (page) {
        var pageData = {
            archive: siteData.archive,
            config: config,
            navigation: siteData.navigation,
            page: page,
            recentPosts: siteData.recentPosts
        };

        _.each(siteData.navigation, function (item) {
            item.active = (item.slug == page.slug) ? true : false;
        });

        if (page.slug === 'home') {
            var path = config.path.dist;
            pageData.pageTitle = setPageTitle(config.siteTitle);
            pageData.showRecent = true;
            pageData.isHome = true;
        } else {
            var path = config.path.dist + page.slug + '/';
            pageData.pageTitle = setPageTitle(page.navigationTitle);
        }

        createPage({
            layout: page.layout,
            pageData: pageData,
            path: path
        });
    });

    _.each(siteData.posts, function (post) {
        var pageData = {
            config: config,
            navigation: siteData.navigation,
            pageTitle: setPageTitle(post.title),
            post: post,
            recentPosts: siteData.recentPosts
        };

        _.forEach(siteData.navigation, function (item) {
            item.active = false;
        });

        createPage({
            layout: post.layout,
            path: config.dist + post.year + '/' + post.slug + '/',
            pageData: pageData
        });
    });

    _.each(siteData.tags, function (tag) {
        var pageData = {
            config: config,
            navigation: siteData.navigation,
            pageTitle: setPageTitle('Tag: ' + tag.name),
            recentPosts: siteData.recentPosts,
            tag: tag
        };

        createPage({
            layout: 'tag',
            pageData: pageData,
            path: config.path.dist + '/tag/' + tag.name + '/'
        });
    });
}

module.exports = build;