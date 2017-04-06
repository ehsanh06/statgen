'use strict';

const fs = require('fs');
const _ = require('underscore');
const fm = require('front-matter');
const handlebars = require('handlebars');
const marked = require('marked');
const moment = require('moment');
var sass = require('node-sass');

let config = require('./config');
const utils = require('./utils');

let siteData = {
    posts: [],
    pages: [],
    tags: [],
    navigation: []
}

const buildFile = '.statgen-build';

let pagesToCreate = [];
let latestBuildFiles = [];
let previousBuildFiles = [];

let showArchive = false;

function registerPartials() {
    fs.readdirSync(config.paths.includes).forEach((file) => {
        handlebars.registerPartial(file.split('.')[0], fs.readFileSync(config.paths.includes + '/' + file, 'utf8'));
    });
}

function readMarkdownFiles() {
    if (utils.pathExists(config.paths.pages)) {
        fs.readdirSync(config.paths.pages).forEach((file) => {
            if (file.split('.')[1] !== 'md') return;

            const data = fm(fs.readFileSync(config.paths.pages + '/' + file, 'utf8'));
            const page = data.attributes;

            page.content = marked(data.body);
            siteData.pages.push(page);
        });
    }
    if (utils.pathExists(config.paths.posts)) {
        const posts = fs.readdirSync(config.paths.posts);

        if (posts.length > 0) {
            showArchive = true;
        }

        posts.forEach((file) => {
            if (file.split('.')[1] !== 'md') return;

            const data = fm(fs.readFileSync(config.paths.posts + '/' + file, 'utf8'));
            const post = data.attributes;

            post.monthDayDate = moment(post.date).format('MMM DD');
            post.shortDate = moment(post.date).format('MMM DD, YYYY');
            post.niceDate = moment(post.date).format('Do MMMM YYYY');
            post.year = moment(post.date).format('YYYY');
            post.content = marked(data.body);

            _.each(post.tags, (tag) => {
                siteData.tags.push({
                    post: post,
                    tag: tag
                });
            });

            siteData.posts.push(post);
        });
    }
}

function aggregateSiteData() {

    siteData.posts = _.sortBy(siteData.posts, 'date').reverse();
    siteData.recentPosts = siteData.posts.slice(0, config.recentPostLimit);

    let postsByTag = _.groupBy(siteData.tags, 'tag');
    siteData.tags = [];

    _.mapObject(postsByTag, (val, key) => {
        siteData.tags.push({
            name: key,
            posts: val
        });
    });

    let postsByYear = _.groupBy(siteData.posts, 'year');
    config.archive.items = [];
    _.mapObject(postsByYear, (val, key) => {
        config.archive.items.push({
            posts: val,
            year: key
        });
    });

    config.archive.items.reverse();

    siteData.navigation.push({
        active: false,
        order: 0,
        slug: 'index',
        title: 'Home',
        url: '/'
    });

    _.each(siteData.pages, (page) => {
        if (page.navigation) {
            siteData.navigation.push({
                active: false,
                order: page.order,
                slug: page.slug,
                title: page.navigationTitle,
                url: '/' + page.slug + '/'
            });
        }
    });

    if (showArchive) {
        siteData.navigation.push({
            active: false,
            order: config.archive.navOrder,
            slug: config.archive.name,
            title: utils.capitalizeFirstLetter(config.archive.name),
            url: `/${config.archive.name}/`
        });
    }

    siteData.navigation = _.sortBy(siteData.navigation, 'order');
}


function aggregatePagesData() {

    let basePath = (config.paths.site == '') ? '' : `${config.paths.site}/`;

    /**
     * Create index/homepage page data
     */
    pagesToCreate.push({
        layout: 'index',
        path: basePath,
        slug: 'index',
        pageData: {
            title: `${config.name} - ${config.description.short}`
        }
    });

    /**
     * Create archive page data
     */
    if (showArchive) {
        pagesToCreate.push({
            layout: 'archive',
            path: `${basePath}${config.archive.name}/`,
            slug: config.archive.name,
            pageData: {
                title: `${utils.capitalizeFirstLetter(config.archive.name)} - ${config.name}`,
                heading: utils.capitalizeFirstLetter(config.archive.name)
            }
        });
    }

    /**
     * Create pages data
     */
    _.each(siteData.pages, (page) => {
        pagesToCreate.push({
            layout: page.layout,
            path: basePath + page.slug + '/',
            slug: page.slug,
            pageData: {
                title: `${page.navigationTitle} - ${config.name}`,
                heading: page.title,
                content: page.content
            }
        });
    });

    /**
     * Create posts page data
     */
    _.each(siteData.posts, (post) => {
        pagesToCreate.push({
            layout: post.layout,
            path: basePath + post.year + '/' + post.slug + '/',
            slug: config.archive.name,
            pageData: {
                title: `${post.title} - ${config.name}`,
                heading: post.title,
                post
            }
        });
    });

    /**
     * Create tags page data
     */
    _.each(siteData.tags, (tag) => {
        pagesToCreate.push({
            layout: 'tag',
            path: `${basePath}tag/${tag.name}/`,
            slug: 'tags',
            pageData: {
                title: `Tag: ${tag.name} - ${config.name}`,
                heading: `Tag: ${tag.name}`,
                tag
            }
        });
    });
}

function processStyles() {
    return new Promise((resolve, reject) => {
        const result = sass.renderSync({
            file: config.paths.styles,
            outputStyle: 'compressed'
        });
        config.styles = result.css.toString();
        resolve();
    });
}

function createAllPages() {
    return new Promise((resolve) => {
        processStyles().then(() => {
            let pages = [];
            _.each(pagesToCreate, (page) => {
                pages.push(new Promise((res, rej) => {
                    createPage(page, res);
                }));
            });
            Promise.all(pages).then(() => {
                resolve();
            });
        });
    });
}

function createPage(data, resolve) {

    setCurrentNavigation(data.slug);

    const filePath = `${data.path}index.html`;
    const layout = fs.readFileSync(`${config.paths.layouts}/${data.layout}.html`, 'utf-8');
    const template = handlebars.compile(layout);

    config.navigation = siteData.navigation;
    config.recentPosts = siteData.recentPosts;

    const html = template({
        pageData: data.pageData,
        siteData: config
    });

    utils.createFileWithPath(filePath, html).then((file) => {
        resolve();
    });
}

function logPagesAndDeleteDead() {
    createLogFile().then(() => {
        _.each(pagesToCreate, (page) => {
            fs.appendFileSync(buildFile, `${page.path}index.html\n`);
            latestBuildFiles.push(`${page.path}index.html`);
        });
        deletedDeadPages();
    });
}

function createLogFile() {
    return new Promise((resolve) => {
        if (utils.pathExists(buildFile)) {
            previousBuildFiles = fs.readFileSync(buildFile, 'utf8').trim().split('\n');
            fs.truncateSync(buildFile, 0);
            resolve();
        } else {
            utils.createFileWithPath(buildFile, '').then(() => {
                resolve();
            });
        }
    });
}

function deletedDeadPages() {
    return new Promise((resolve, reject) => {
        const filesToDelete = _.difference(previousBuildFiles, latestBuildFiles);
        _.each(filesToDelete, (file) => {
            fs.unlink(file, () => {
                const filename = file.split('/').pop();
                const path = file.split(filename)[0];
                fs.rmdirSync(path);
            });
        });
        resolve();
    });
}

function setCurrentNavigation(slug) {
    siteData.navigation.forEach((item) => {
        item.active = false;
        if (slug == item.slug) {
            item.active = true;
        }
    });
}

module.exports = () => {
    config = config();
    Promise.all([
        registerPartials(),
        readMarkdownFiles(),
        aggregateSiteData(),
        aggregatePagesData(),
        createAllPages(),
        logPagesAndDeleteDead()
    ]).then(() => {
        console.log('Statgen: Site build successfully completed.');
    });
}