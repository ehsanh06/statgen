# Statgen 

Stategen is a simple static website generator using `node`, `gulp`, `markdown` and `handlebars`. 

## Usage

### Creating Pages

You can generate new pages using the following command:

```
Usage:

gulp page [ -t | --title ] <Your page title> [ -s | --slug ] <Your URL Slug>
```
> -t or --title is a mandatory argument to input
>> -s or --slug is an optional argument to input

```
Examples:

gulp page -t "testPage"

gulp page --title "testPage"

gulp page -t "testPage" -s "test"

gulp page --title "testPage" --slug "test"
```

> This generates an `md` file in the `pages` directory

Ensuring that you have created a new `markdown` page, you can edit the content and default metadata.

### Creating Posts

You can generate new posts in your pages, using the following command:

```
Usage:

gulp post [ -t | --title ] <Your page title> [-s | --slug ] <Your URL Slug>
```

> -t or --title is a mandatory argument to input
>> -s or --slug is an optional argument to input

```
Examples:

gulp post -t "testPage"

gulp post --title "testPage"

gulp post -t "testPage" -s "test"

gulp post --title "testPage" --slug "test"
```
> This generates an `md` file in the `posts` directory

Ensuring that you have created a new `markdown` post, you can edit the content and default metadata.

## Generating the static site

Use the following command to generate the site from `markdown` to `html` ready for deployment:

```
gulp build
```
