# Webpage to PDF Resume

A straightforward resume or CV template for the web, print, or PDF. Built with [Astro](https://astro.build) and [PandaCSS](https://panda-css.com).

## Who's this for?

As a web developer, I got frustrated with Google Doc templates or resume builder sites that either cost a lot of money or have problems with their designs. When putting together my one-page resume, I knew how I wanted things to look, and I just wanted to use markup and CSS to make it!

So I built this template to make it easy to bootstrap a readable and tasteful resume. It's structured to look great on the web, and produce a balanced, well-formatted one-pager when saved as a PDF or printed. The personal information is abstracted into JSON to make it easy to create new templates.

## How to use it

### Setup

Fork and clone the repo. Note that [bun](https://bun.sh) is required.

```sh
# Install dependencies
bun install
# Start development server
bun dev
```

All of the personal information that populates the template is located in `src/data.json`. Update this file with all of your information.

### Customize Look & Feel

The template uses PandaCSS and its [default theme](https://panda-css.com/docs/customization/theme). It gives you all of the base tokens to quickly build out new designs or modify this one. To change the accent color or some of the default styling, update the `panda.config.ts` file.

The provided font is [Rubik](https://fontsource.org/fonts/rubik). To change the font, find a font to your liking on [Fontsource](https://fontsource.org) and install it following their instructions.

The provided favicon was generated from [favicon.io](https://favicon.io). Use your own favicon, or generate one there, and delete the provided favicon files in `/public`.

## Printing

The structure and content of this resume template is intended to fit onto a single page, suitable for a one-page resume. Depending on your personal information, the length may break onto a second page. I'd recommend futzing with the base font-size in the `src/index.css` file or adjust vertical spacing in the template to make it fit one page. You can also adjust the page margins for printing in the `src/index.css` file.

To save as a PDF, open the print window, then follow the prompts for saving as a PDF instead of actually printing.

## Blocking search engines

Disable search engine indexing by adding the following code to the <head> in `src/layouts/Layout.astro`:

```html
<meta name="robots" content="noindex" />
```

## License

NonCommercial-ShareAlike 1.0 Generic (CC NC-SA 1.0)
https://creativecommons.org/licenses/nc-sa/1.0/

### You are free to:

Share — copy and redistribute the material in any medium or format

Adapt — remix, transform, and build upon the material

### Under the following terms:

NonCommercial — You may not use the material for commercial purposes.

ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

## Acknowledgements

Hat-tip to [WebPraktikos/universal-resume](https://github.com/WebPraktikos/universal-resume) for showing what's possible with structuring and adapating a resume webpage for print. This is still a great and relevant project. I wanted to make a slightly different project in order to use web technologies I preferred and to abstract the data so that I could make different templates should I desire it.
