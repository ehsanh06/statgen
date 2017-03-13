# Statgen 

Statgen is a in-built CLI that is designed to be a simple static website generator using, `node`, `markdown` and `handlebars`. 

## Usage

### New Project

You can create a new project usng the following command:

```
Usage:

statgen new

```

### Creating Pages

TODO: New page templates match template name?

You can generate new pages using the following command:

```
Usage:

statgen page [ -t | --title ] <Your page title> [ -s | --slug ] <Your URL Slug>
```
> -t or --title is a mandatory argument to input

> -s or --slug is an optional argument to input

```
Examples:

statgen page -t "testPage"

statgen page --title "testPage"

statgen page -t "testPage" -s "test"

statgen page --title "testPage" --slug "test"
```

> This generates an `md` file in the `pages` directory

Ensuring that you have created a new `markdown` page, you can edit the content and default metadata.

### Creating Posts

You can generate new posts in your pages, using the following command:

```
Usage:

statgen post [ -t | --title ] <Your page title> [-s | --slug ] <Your URL Slug>
```

> -t or --title is a mandatory argument to input

> -s or --slug is an optional argument to input

```
Examples:

statgen post -t "testPage"

statgen post --title "testPage"

statgen post -t "testPage" -s "test"

statgen post --title "testPage" --slug "test"
```
> This generates an `md` file in the `posts` directory

Ensuring that you have created a new `markdown` post, you can edit the content and default metadata.

## Generating the static site

Use the following command to generate the site from `markdown` to `html` ready for deployment:

```
statgen build
```