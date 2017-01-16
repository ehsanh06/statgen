'use strict';

var argv = require('yargs').argv;
var fs = require('fs');
var mkdirp = require('mkdirp');
var moment = require('moment');

var config = require('./config.json');

function post(title, slug) {
    console.log('Console Message: Building Post');
    if (title) {

        var path = (argv.d || argv.default) ? config.path.drafts : config.path.posts;
        var filename = path + moment().format('DD-MM-YY') + '-' + slug + '.md';

        fs.access(filename, fs.constants.F_OK, function(err) {
            if (!err) {
                return 'Task aborted: File ' + filename + ' already exists.';
            }
            var meta =
                '---\r\n' +                             
                'date: ' + moment().format() + '\r\n' + 
                'layout: post\r\n' +                   
                'slug: ' + slug + '\r\n' +             
                'tags: []\r\n' +                        
                'title: "' + title + '"\r\n' +          
                '---\r\n' +                            
                ' <Insert your content here> \r\n ';

            mkdirp(path, function(err) {
                if (err) return err;
                fs.writeFile(filename, meta, function(err) {
                    if (err) return err;
                    console.log('Task success - Your new post was successfully created: ', filename);
                });
            });
        });
    } else {
        return 'Error: You must enter a title for your page. Use --title "Page title" or -t "Page title"';
    }
};

module.exports = post;