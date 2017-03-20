# Statgen 

Statgen is a Jekyll-inspired static blog-aware site generator, using `NodeJS`, `Markdown` and `Handlebars`. It offers a simple CLI, making site generation effortless.

## Installation

Install Statgen with NPM. Run the following command to install `statgen` globally at a terminal prompt.

```
$ npm install statgen -g
```

## Usage

Create a new `statgen` site in the current folder by using:

```
$ statgen new
```

This will create default source files and folders, along with a configuration file. Once this is in place, you can then run a build task like below.

```
$ statgen build
```

At this point, the site has been coverted into `html` files and your site is ready for deployment.

**Pages and Posts**

You can create new posts and pages using either of the following commands:

```
# Generate a page markdown file
$ statgen page -t "About" -s "about"
$ statgen page --title "About" --slug "about"

# Generate a post markdown file
$ statgen post -t "First post"
$ statgen post --title "First post"
```

Once you have run a new page or post task, a `.md` file will be created in the relavent directory. You can edit the file by adding `markdown` content. Run the build task to re-generate the site.

## Directory Structure

```
├── _includes
|   ├── footer.hbs
|   ├── header.hbs
|   ├── nav.hbs
|   └── recent.hbs
├── _layouts
|   ├── archive.html
|   ├── index.html
|   ├── page.html
|   ├── post.html
|   └── tag.html
├── _pages
|   └── about.md
├── _posts
|   └── 20-03-17-first-post.md
├── _site
├── _statgen.json
└── .statgen-build
```
An overview of what each of these does:

| File/Directory | Description |
|---|---|
| `_includes` | These are the partials that can be mixed and matched by your layouts to facilitate reuse. |
| `_layouts` | These are the templates that wrap posts and pages. Here you can add layouts and assign them to the markdown files on an individual basis. |
| `_pages` | This is where Statgen saves generates pages as `markdown` files. |
| `_posts` | This is where Statgen saves generates posts as `markdown` files. |
| `_site` | This is where the generated site will be placed (by default) once Statgen is done buildiing the site. It's probably a good idea to add this to your `.gitignore` file |
| `_statgen.json` | Stores configuration data. |
| `.statgen-build` | This helps Statgen keep track of which files have not been modified since the site was last build. It's probably a good idea to add this to your `.gitignore` file. |

## Configuration

Configuration options are specified in a `_statgen.json` file placed in your site’s root directory. ***Please DO NOT delete any of the default JSON object properties in this file***. You can, however, update the values of the properties to suit the needs of your project.

Any added properties add to the `JSON` object will be available via `siteData` in templates. See below:

`_statgen.json`

```
...

"paths": {
        "pages": "_pages",
        "posts": "_posts",
        "layouts": "_layouts",
        "includes": "_includes",
        "site": "_site"
    },
    "googleTrackingCode": "UA-XXXXX-X"
}
```

`_includes/footer.hbs`
```
...
    <script>
        window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
        ga('create', '{{ siteData.googleTrackingCode }}', 'auto');
        ga('send', 'pageview');
    </script>
    <script async src='https://www.google-analytics.com/analytics.js'></script>
...
```

## Backlog

Below is a list of features that will be potentially added to Statgen in the near future.

- Assets folder copied into the build `site` folder during build task
- `SASS` pre-processing during build task
- Data files in `_data` to be accessed via `siteData` in templates


