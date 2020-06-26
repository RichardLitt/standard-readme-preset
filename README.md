# standard-readme-preset

[![Greenkeeper badge](https://badges.greenkeeper.io/RichardLitt/standard-readme-preset.svg)](https://greenkeeper.io/)

[`remark`][remark] preset to configure [`remark-lint`][lint] with settings that
enforce [`standard-readme`][stdr].

## Install

npm:

```sh
npm install standard-readme-preset
```

## Usage

You probably want to use it on the CLI through a config file:

```diff
 ...
 "remarkConfig": {
+  "plugins": ["standard-readme-preset"]
 }
 ...
```

Or use it on the CLI directly

```sh
remark -u standard-readme-preset README.md
```

Or use this on the API:

```diff
 var remark = require('remark');
 var report = require('vfile-reporter');

 remark()
+  .use(require('standard-readme-preset'))
   .process('_Emphasis_ and **importance**', function (err, file) {
     console.error(report(err || file));
   });
```

## Rules

This preset configures [`remark-lint`][lint] with the following rules:

*   [`remark-lint:appropriate-heading`](https://github.com/RichardLitt/remark-lint-appropriate-heading)
    — Check that the top-level heading matches the directory name
*   [`standard-readme:file-extension`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/file-extension.js)
    — Check that `md` is used as a file extension
*   [`standard-readme:file-stem`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/file-stem.js)
    — Check that `README` is used as a file stem (allows i18n: `README.de`, `README.en-GB`)
*   [`standard-readme:require-file-extension`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/require-file-extension.js)
    — Check that a file extension is used
*   [`standard-readme:no-unknown-sections`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/no-unknown-sections.js)
    — Check that only known sections are used, except for in the extra sections
*   [`standard-readme:require-sections`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/require-sections.js)
    — Check that required sections (`contributing`, `license`) exist.
    `table-of-contents` is required if `toc: true` is given, optional for
    `toc: false`, and otherwise inferred based on if the number of lines in the
    file, excluding the ToC itself, exceeds 100.
    `install` and `usage` are required if `installable: true` is given.
*   [`standard-readme:section-order`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/section-order.js)
    — Check that sections are used in the order they’re supposed to

## Contributing

Please do! Open an issue!

## License

[ISC][] © [Richard Littauer][author]

[author]: http://burntfen.com

[isc]: LICENSE

[remark]: https://github.com/wooorm/remark

[lint]: https://github.com/wooorm/remark-lint

[stdr]: https://github.com/RichardLitt/standard-readme

