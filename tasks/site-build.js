// Task which takes care of the actual site build itself
gulp.task('site-build', function() {

    // calling build method from statgen - this logs Statgen: Build1
    statgen.build();

    // siteData will hold the meta information for the site
    var siteData = {
        posts: [],
        pages: [],
        archive: [],
        tags: [],
        navigation: []
    };
    
    // Local functions
    readMarkdownFiles();
    createAuxiliaryData();
    createAllPages();
    
    function readMarkdownFiles() {
        
        // Validating if the directory does exist
        if(directoryExists(paths.posts)) {

            // FileSystem will read the dir for posts and loop through each file
            fs.readdirSync(paths.posts).forEach(function(file) {

                // Return, if after the . split is not equal to the MD file extension 
                if(file.split('.')[1] != config.markdownFileExtention) return;
                
                // Add meta-data to content via fm for the the posts method and it's corresponding
                // file using the UTF-8 format
                var data = fm(fs.readFileSync(paths.posts + file, 'utf8'));
                var post = data.attributes;
                
                // Date formatting
                post.year      = moment(post.date).format('YYYY');
                post.niceDate  = moment(post.date).format('Do MMMM YYYY');
                post.shortDate = moment(post.date).format('MMM DD');

                // post.content is marked to the DOM Body Object
                post.content = marked(data.body);
                
                // Pushing tags to the siteData.tags array
                _.each(post.tags, function(tag){
                    siteData.tags.push({
                        tag: tag,
                        post: post
                    });
                });

                // Pushing posts to the siteData.posts array
                siteData.posts.push(post);
            });
        }
        
        // Validating if the directory does exist
        if(directoryExists(paths.pages)) {

            // FileSystem will read the dir for pages and loop through each file
            fs.readdirSync(paths.pages).forEach(function(file) {

                // Return, if after the . split is not equal to the MD file extension 
                if(file.split('.')[1] != config.markdownFileExtention) return;
                
                // Add meta-data to content via fm for the the pages method and it's corresponding
                // file using the UTF-8 format
                var data = fm(fs.readFileSync(paths.pages + file, 'utf8'));
                var page = data.attributes;
                
                // page.content is marked to the DOM Body Object
                page.content = marked(data.body);

                // We'll then add all this to the siteData.pages empty array
                siteData.pages.push(page);
            });
        }
    }
    
    function createAuxiliaryData() {

        // Sort articles in decending order
        siteData.posts = _.sortBy(siteData.posts, 'date').reverse();
        
        // Get latest articles and store this to siteData.recentPosts 
        siteData.recentPosts = siteData.posts.slice(0, config.recentPostsLimit);
        
        // Create tags
        var postsByTag = _.groupBy(siteData.tags, 'tag');
        siteData.tags = [];
        _.mapObject(postsByTag, function(val, key) {
            siteData.tags.push({
                name: key,
                posts: val
            });
        });
        
        //  Create archive by year
        var postsByYear = _.groupBy(siteData.posts, 'year');
        _.mapObject(postsByYear, function(val, key) {
            siteData.archive.push({
                year: key,
                posts: val
            });
        });
        siteData.archive.reverse();
        
        //  Create navigation
        _.each(siteData.pages, function(page){

            // If there is navigation on page
            if(page.navigation) {

                // Push the following Object into siteData navigation Object array
                siteData.navigation.push({
                    slug: page.slug,
                    title: page.navigationTitle,
                    url: (page.slug === 'home') ? '/' : '/' + page.slug + '/',
                    active: false,
                    order: page.order
                });
            }
        });

        // Sort the Navigation by order
        siteData.navigation = _.sortBy(siteData.navigation, 'order');
    }
    

    function createAllPages() {

        // Looping through siteData.pages with callback
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
                var path = paths.dist;
                pageData.pageTitle = setPageTitle(config.siteTitle);
                pageData.showRecent = true;
                pageData.isHome = true;
            } else {
                var path = paths.dist + page.slug + '/';
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
            
            // Resetting navigation active state
            _.forEach(siteData.navigation, function(item) {
                item.active = false; 
            });
            
            createPage({
                layout: post.layout,
                path: paths.dist + post.year + '/' + post.slug + '/',
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
                path: paths.dist + '/tag/' + tag.name + '/',
                pageData: pageData
            });
        });
        
    }
    
    function createPage(data) {
        var layout   = fs.readFileSync(paths.layouts + data.layout + '.html', 'utf8');
        var template = handlebars.compile(layout)
        var html     = template(data.pageData);
            
        // Create a directory relative to data.path    
        mkdirp(data.path, function(err) {
            
            // Error handler
            if(err) return console.log(err);

            // FileSystem will write to the path of index.html in html format
            fs.writeFile(data.path + 'index.html', html, function(err) {

                // Error handler
                if(err) return console.log(err);
            });
        });
    }
    
    function setPageTitle(title) {
        return title + ' - ' + config.author;
    }
    
    function capitalize(str) {
        return str[0].toUpperCase() + str.slice(1);
    }

    // Function to test code block for any errors
    function directoryExists(path) {
        try {
            fs.statSync(path);
            return true;
        } catch(err) {
            return false;
        }
    }
});
