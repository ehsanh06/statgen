/**
 * @module statgen
 */

function newPage(opt) { if(!opt.title) return; }

function newPost(opt) { }

function hyphenateSlug(slug) { return slug.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, '-'); }

function build() { console.log('Statgen: Build'); }

module.exports = {
    build: build,
    newPage: newPage,
    newPost: newPost
}