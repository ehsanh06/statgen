module.exports = function(gulp) {
    // global.js
    require('../lib/global'),
    // post.js
    require('./post/post')(gulp);
    // page.js
    require('./page/page')(gulp);

};