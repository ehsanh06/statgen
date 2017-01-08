// Include Gulp and Plugins
var _       = require('underscore');
var argv    = require('yargs').argv;
var fs      = require('fs');
var gulp    = require('gulp');
var marked  = require('marked');
var mkdirp  = require('mkdirp');

// Define base folders
var paths = {
    pages: './views/pages/',
    posts: './views/posts/',
    drafts: './views/drafts/',
    layouts: './views/',
    // includes: './includes/',                     Come back to this
    sass: './public/src/sass/**/*.scss',
    dist: './dist/',
    distCss: './dist/css/'
}


// Gulp Task for generating a new page
gulp.task('new-page', function() {

    /*   Declaration of a new page   */

    // Making sure the user inputs title or t in the CLI  when creating a new page
    if (argv.title || argv.t) {
        var title = argv.title || argv.t;
    } else {
    
        // Otherwise we log the error out to the console as there was no valid input, --title or, -t.    
        return 'Error: Invalid input - Use --title "Page Title" or, -t "Page Title"'.red;
    }
    
    // Conditional: if any of inputs are either slug or, s (arv.slug/arv.s respectively) are true 
    // we'll then hyphenateSlug and store this to slug, otherwise we'll convert title to a string
    var slug = (argv.slug || argv.s) ? hyphenateSlug(argv.slug || argv.s) : hyphenateSlug(title.toString());
    

    /*      Saving the page     */
    
    // Setting Filename by having the value of the file path of the page in question
    var filename = paths.pages + slug + '.md';
    
    // fs.access determines if a file exists, regardless of rwx permissions
    fs.access(filename, fs.F_OK, function(err) {
       
       // Since this exists, then we can log to the console that this file(in question) exists
        if(!err) { 
            return colors.red('Task completed prematurely: ' + filename + ' already exists.'); 
        }

        var meta = '---\r\n' +                          // --- CR/NL regex
            'date: ' + moment().format() + '\r\n' +     // Date format, CR/NL regex
            'layout: page\r\n' +                        // Layout: page CR/NLregex
            'navigation: false\r\n' +                   // Navigation set to false, CR/NL regex
            'navigationTitle: "' + title + '"\r\n' +    // NavTitle, title variable CR/NL regex
            'order: 0\r\n' +                            // Order of the page CR/NL regex
            'slug: ' + slug + '\r\n' +                  // slug variable, CR/NL regex
            'title: "' + title + '"\r\n' +              // Title of the page CR/NL regex
            '---\r\n' +                                 // --- CR/NL regex
            ' <Place Content Here> \r\n';               // Place content here, CR/NL regex

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