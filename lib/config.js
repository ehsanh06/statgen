var fs = require('fs');
var utils = require('./utils');

module.exports = function () {

    var config = {
        "author": "Ehsan Hussain",
        "email": "ehsanhussain991@gmail.com",
        "siteTitle": "Hello world!",
        "description": "Some description...",
        "usernames": {
            "github": "ehsanh06",
            "linkedin": "ehsanh06",
            "twitter": "ehsanh06"
        },
        "archive": true,
        "recentPostLimit": 5,
        "currentMenuClass": "menu__item__current",
        "paths": {
            "pages": "_pages/",
            "posts": "_posts/",
            "layouts": "_layouts/",
            "includes": "_includes/",
            "site": "_site/"
        }
    }

    var rootConfig = '../config.json';

    if (fs.existsSync(rootConfig)) {
        fs.readFile(rootConfig, function read(err, data) {
            if (err) throw err;

            return JSON.parse(data);
        });
    } else {
        return config;
    }
}