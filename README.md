# Statgen 

Statgen is a Jekyll-inspired static blog-aware site generator, using `NodeJS`, `Markdown` and `Handlebars`. It offers an simple easy-to-use CLI, making site generation effortless.

## Installation

Install Statgen with NPM. Run the following command to install `statgen` globally at a terminal prompt.

```
$ npm install statgen -g
```

## Basic Usage

Create a new `statgen` site using the current folder by using:

```
$ statgen new
```

Once you have created a new `statgen` site, you can then generate a static build using the command below. This will read the `markdown` files and converted in to `html`.

```
$ statgen build
```

At this stage, your site is ready for deployment.

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

Once you have created a new page or post, a `.md` file will be created in the relavent directory. You can now add `markdown` content to the file. Run `statgen build` again to re-generate the site.

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
├── _posts
|   └── 2017-03-14-first-post.md
├── _site
├── _statgen.json
└── .statgen-build
```
An overview of what each of these does:

| File/Directory | Description |
|---|---|
| _includes | |
| _layouts |  |
| _posts |  |
| _site | This is where the generated site will be placed (by default) once Statgen is done transforming it. It’s probably a good idea to add this to your .gitignore file |
| _statgen.json | Stores configuration data. |
| .statgen-build | This helps Statgen keep track of which files have not been modified since the site was last build. It's probably a good idea to add this to your `.gitignore` file. |

## Configuration

Configuration options are specified in a `_statgen.json` file placed in your site’s root directory.