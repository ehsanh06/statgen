var fs = require('fs');
var utils = require('./utils');

module.exports = function() {

    var config = {
        "author": "Blog Man",
        "title": "Blog",
        "description": "Blog generated using Statgen",
        "links": [
            {
                "name": "GitHub", 
                "url": "https://github.com/ehsanh06"
            },
            {
                "name": "Twitter", 
                "url": "http://twitter.com/ehsanh06"
            }
        ],
        "archive": true,
        "recentPostLimit": 5,
        "currentMenuClass": "current",
        "paths": {
            "pages": "_pages/",
            "posts": "_posts/",
            "layouts": "_layouts/",
            "includes": "_includes/",
            "site": "_site/"
        }
    }

    var rootConfigPath = './config.json';

    if (utils.pathExists(rootConfigPath)) {
        var configData = fs.readFileSync(rootConfigPath, 'utf-8');
        return configData;
    } else {
        return config;
    }
}