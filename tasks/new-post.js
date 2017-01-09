// Include Gulp and Plugins
var _       = require('underscore');
var argv    = require('yargs').argv;
var fs      = require('fs');
var gulp    = require('gulp');
var mkdirp  = require('mkdirp');

// Define base folders
var paths = {
    pages: './views/pages/',
    posts: './views/posts/',
    drafts: './views/drafts/',
    layouts: './views/',
    includes: './public/src/js/',
    sass: './public/src/sass/**/*.scss',
    dist: './dist/',
    distCss: './dist/css/'
}

// Gulp task for generating a new post
gulp.task('new-post', function() {

    // Checking if character input is title or t
    if (argv.title || argv.t) {
        var title = argv.title || argv.t;

    // Otherwise we will return an error     
    } else {
        return 'Error: Invalid input - You must enter a title for your post. Use --title "Post title" or, -t "Post title"'.red;
    }
    
    // If argv.d/draft is true, we'll return drafts method, which is stored in the path variable
    var path = (argv.d || argv.draft) ? paths.drafts : paths.posts;

    // Hyphenate the title
    var slug = hyphenateSlug(title);

    // Define the filename
    var filename = path + moment().format('YYYY-MM-DD') + '-' + slug + '.md';
    
    // fs.access determines if a file exists, regardless of rwx permissions
    fs.access(filename, fs.F_OK, function(err) {

        // If this exists then we log to the console, that this file exists.
        if(!err) {
            return colors.red('Task completed prematurely: ' + filename + ' already exists.');
        }
        
        var meta = '---\r\n' +                                  // --- CR/NL regex
            'date: ' + moment().format() + '\r\n' +             // Date format, CR/NL regex
            'layout: post\r\n' +                                // Layout: page CR/NLregex
            'slug: ' + slug + '\r\n' +                          // slug variable, CR/NL regex
            'tags: []\r\n' +                                    // Tags, if applicable CR/NL regex
            'title: "' + title + '"\r\n' +                      // Title of the page CR/NL regex
            '---\r\n' +                                         // --- CR/NL regex
            ' <Place Content Here> \r\n'                        // Place content here, CR/NL regex

        // Creating a directory corresponding to the paths.page string (filepath)             
        mkdirp(paths.pages, function(err) {

            // Error handler
            if(err) return console.log(err);

            // FileSystem will now write the file according to filename/meta
            fs.writeFile(filename, meta, function(err) {
                
                // Error handler
                if(err) return console.log(err);
                
                // Log to the console the success of the page generated
                return 'New page file has successfully been created: ' + filename;
            });
        });
    });
});