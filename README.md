# standard-readme-preset

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

*   [`file-extension`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/file-extension.js)
    — Check that `md` is used as a file extension
*   [`file-stem`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/file-stem.js) 
  — Check that `README` is used as a file stem (allows i18n: `README.de`, `README.en-GB`)
*   [`require-file-extension`](https://github.com/RichardLitt/standard-readme-preset/blob/master/rules/require-file-extension.js) 
  — Check that a file extension is used

## Contribute

Please do! Open an issue!

## License

[ISC][] © [Richard Littauer][author]

[author]: http://burntfen.com

[isc]: LICENSE

[remark]: https://github.com/wooorm/remark

[lint]: https://github.com/wooorm/remark-lint

[stdr]: https://github.com/RichardLitt/standard-readme

