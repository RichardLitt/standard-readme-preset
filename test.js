var test = require('tape')
var remark = require('remark')
var vfile = require('vfile')
var lint = require('remark-lint')
var fileStem = require('./rules/file-stem')
var fileExtension = require('./rules/file-extension')
var requireFileExtension = require('./rules/require-file-extension')
var noUnknownSections = require('./rules/no-unknown-sections')
var requireSections = require('./rules/require-sections')
var sectionOrder = require('./rules/section-order')

test('standard-readme', function (t) {
  t.test('file-stem', function (st) {
    var processor = remark().use(lint).use(fileStem)

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.md' })).messages.map(String),
      [],
      'ok for `README.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.mkd' })).messages.map(String),
      [],
      'ok for `README.mkd`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.de.md' })).messages.map(String),
      [],
      'ok for `README.de.md`, an internationalized README with a language tag'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.nl-BE.md' })).messages.map(String),
      [],
      'ok for `README.nl-BE.md`, an internationalized README with a language tag and region tag'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/readme.md' })).messages.map(String),
      ['~/readme.md:1:1: Expected `README` instead of `readme` as file name'],
      'not ok for `readme.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/CONTRIBUTING.md' })).messages.map(String),
      ['~/CONTRIBUTING.md:1:1: Expected `README` instead of `CONTRIBUTING` as file name'],
      'not ok for `CONTRIBUTING.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/readme.de.md' })).messages.map(String),
      ['~/readme.de.md:1:1: Expected `README` instead of `readme` as file name'],
      'not ok for `readme.de.md`, an internationalized README with a language tag'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/readme.nl-BE.md' })).messages.map(String),
      ['~/readme.nl-BE.md:1:1: Expected `README` instead of `readme` as file name'],
      'not ok for `readme.nl-BE.md`, an internationalized README with a language tag and region tag'
    )

    st.end()
  })

  t.test('file-extension', function (st) {
    var processor = remark().use(lint).use(fileExtension)

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.md' })).messages.map(String),
      [],
      'ok for `README.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README' })).messages.map(String),
      [],
      'ok for `README`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/contributing.md' })).messages.map(String),
      [],
      'ok for `contributing.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/readme.mkd' })).messages.map(String),
      ['~/readme.mkd:1:1: Expected `md` instead of `mkd` as extension'],
      'not ok for `readme.mkd`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.markdown' })).messages.map(String),
      ['~/README.markdown:1:1: Expected `md` instead of `markdown` as extension'],
      'not ok for `README.markdown`'
    )

    st.end()
  })

  t.test('require-file-extension', function (st) {
    var processor = remark().use(lint).use(requireFileExtension)

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README.md' })).messages.map(String),
      [],
      'ok for `README.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/contributing.mkd' })).messages.map(String),
      [],
      'ok for `contributing.mkd`'
    )

    st.deepEqual(
      processor.processSync(vfile({ path: '~/README' })).messages.map(String),
      ['~/README:1:1: Expected file extension'],
      'not ok for `README`'
    )

    st.end()
  })

  t.test('no-unknown-sections', function (st) {
    var processor = remark().use(lint).use(noUnknownSections)

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '# Title',
          '',
          '> Example of an OK readme.',
          '',
          '## Install',
          '',
          '```sh',
          'npm install something',
          '```',
          '',
          '## Usage',
          '',
          '```js',
          'some.thing()',
          '```',
          '',
          '### CLI',
          '',
          '```sh',
          'some --thing',
          '```',
          '',
          '## Custom',
          '',
          'A custom heading.',
          '',
          '## Another Custom',
          '',
          'A custom heading.',
          '',
          '## Contributing',
          '',
          'Something something.',
          '',
          '## License',
          '',
          'SPDX © Some One'
        ].join('\n')
      })).messages.map(String),
      [],
      'ok for only expected sections and extra sections in the right place'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '# Title',
          '',
          '> Example of an OK readme.',
          '',
          '## Install',
          '',
          '```sh',
          'npm install something',
          '```',
          '',
          '## Custom',
          '',
          'An wrongly placed heading.',
          '',
          '## Usage',
          '',
          '```js',
          'some.thing()',
          '```',
          '',
          '### CLI',
          '',
          '```sh',
          'some --thing',
          '```',
          '',
          '## Contributing',
          '',
          'Something something.',
          '',
          '## License',
          '',
          'SPDX © Some One'
        ].join('\n')
      })).messages.map(String),
      [
        '~/README.md:15:1-15:9: Unexpected header section after extra sections (11:1-14:1): move it in front of the extra sections'
      ],
      'not ok for header sections in the extra section'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '# Title',
          '',
          '> Example of an OK readme.',
          '',
          '## Install',
          '',
          '```sh',
          'npm install something',
          '```',
          '',
          '## Usage',
          '',
          '```js',
          'some.thing()',
          '```',
          '',
          '### CLI',
          '',
          '```sh',
          'some --thing',
          '```',
          '',
          '## Custom',
          '',
          'An wrongly placed heading.',
          '',
          '## Contributing',
          '',
          'Something something.',
          '',
          '## Another custom',
          '',
          'An wrongly placed heading.',
          '',
          '## License',
          '',
          'SPDX © Some One'
        ].join('\n')
      })).messages.map(String),
      [
        '~/README.md:31:1-31:18: Unexpected unknown heading in tail: move it to the extra sections (23:1-26:1)'
      ],
      'not ok for unknown sections in the tail sections, with extra sections'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '# Title',
          '',
          '> Example of an OK readme.',
          '',
          '## Install',
          '',
          '```sh',
          'npm install something',
          '```',
          '',
          '## Usage',
          '',
          '```js',
          'some.thing()',
          '```',
          '',
          '### CLI',
          '',
          '```sh',
          'some --thing',
          '```',
          '',
          '## Contributing',
          '',
          'Something something.',
          '',
          '## Custom',
          '',
          'An wrongly placed heading.',
          '',
          '## License',
          '',
          'SPDX © Some One'
        ].join('\n')
      })).messages.map(String),
      [
        '~/README.md:27:1-27:10: Unexpected unknown section in tail: move it in front of the tail (23:1)'
      ],
      'not ok for unknown sections in the tail sections, without extra sections'
    )

    st.end()
  })

  t.test('require-sections', function (st) {
    var processor = remark().use(lint).use(requireSections)

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '# Title',
          '',
          '> Example of an OK readme.',
          '',
          '## Contributing',
          '',
          'Something something.',
          '',
          '## License',
          '',
          'SPDX © Some One'
        ].join('\n')
      })).messages.map(String),
      [],
      'ok for required sections: `contributing` and `license`'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          'Example of an OK readme.',
          '',
          '## Contributing',
          '## License',
          '',
          'SPDX © Some One'
        ].join('\n')
      })).messages.map(String),
      ['~/README.md:1:1: `Contributing` section is empty'],
      'not ok for empty `contributing` section'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          'Example of an OK readme.',
          '',
          '## Contributing',
          '',
          'Something something.',
          '',
          '## License'
        ].join('\n')
      })).messages.map(String),
      ['~/README.md:1:1: `License` section is empty'],
      'not ok for empty `license` section at end of file (coverage)'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections, { toc: true })
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      ['~/README.md:1:1: Missing required `Table of Contents` section'],
      'not ok for a missing `table-of-content` section with `toc: true`'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections)
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One',
            '',
            '## Table of Contents'
          ].join('\n')
        })).messages.map(String),
      [],
      'not ok for an optional `table-of-content` as the last section (coverage)'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections)
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            new Array(89).map(function (d, i) {
              return String.fromCharCode(34 /* '/' */ + i)
            }).join('\n'),
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      ['~/README.md:1:1: Missing required `Table of Contents` section'],
      'not ok for a missing `table-of-content` section by default, if 101 lines long'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections)
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            new Array(88).map(function (d, i) {
              return String.fromCharCode(34 /* '/' */ + i)
            }).join('\n'),
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      [],
      'ok for a missing `table-of-content` section by default, if 100 lines long'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections)
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            '## Table of Contents',
            '',
            new Array(100).map(function (d, i) {
              return String.fromCharCode(34 /* '/' */ + i)
            }).join('\n'),
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      [],
      'the lines used for the table of contents itself are ignored'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections, { toc: true })
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            'Example of an OK readme.',
            '',
            '## Table of Contents',
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      ['~/README.md:1:1: `Table of Contents` section is empty'],
      'not ok for empty `table-of-contents` section'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections, { toc: true })
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            'Example of an OK readme.',
            '',
            '## Table of Contents',
            '',
            '- [Contributing](#contributing)',
            '- [License](#license)',
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      [],
      'ok for `table-of-contents` section with list items only'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections, { installable: true })
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            '## Usage',
            '',
            'Something something.',
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      ['~/README.md:1:1: Missing required `Install` section'],
      'not ok for a missing `install` section with `installable: true`'
    )

    st.deepEqual(
      remark()
        .use(lint)
        .use(requireSections, { installable: true })
        .processSync(vfile({
          path: '~/README.md',
          contents: [
            '# Title',
            '',
            '> Example of an OK readme.',
            '',
            '## Install',
            '',
            'Something something.',
            '',
            '## Contributing',
            '',
            'Something something.',
            '',
            '## License',
            '',
            'SPDX © Some One'
          ].join('\n')
        })).messages.map(String),
      ['~/README.md:1:1: Missing required `Usage` section'],
      'not ok for a missing `usage` section with `installable: true`'
    )

    st.end()
  })

  t.test('section-order', function (st) {
    var processor = remark().use(lint).use(sectionOrder)

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '## Table of Contents',
          '## Security',
          '## Background',
          '## Install',
          '## Usage',
          '## API',
          '## Maintainers',
          '## Contributing',
          '## License'
        ].join('\n\n')
      })).messages.map(String),
      [],
      'ok for properly ordered sections'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '## Table of Contents',
          '## Alpha',
          '## Usage',
          '## Bravo',
          '## Install',
          '## Charlie',
          '## Contributing',
          '## Delta',
          '## License'
        ].join('\n\n')
      })).messages.map(String),
      ['~/README.md:9:1-9:11: Expected `install` before `usage` (5:1-5:9)'],
      'should ignore custom extra sections'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '## Table of Contents',
          '## Security',
          '## Background',
          '## Usage',
          '## Install',
          '## API',
          '## Maintainers',
          '## Contributing',
          '## License'
        ].join('\n\n')
      })).messages.map(String),
      ['~/README.md:9:1-9:11: Expected `install` before `usage` (7:1-7:9)'],
      'not ok for one swapped sections'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '## License',
          '## Table of Contents',
          '## Security',
          '## Background',
          '## Install',
          '## Usage',
          '## API',
          '## Maintainers',
          '## Contributing'
        ].join('\n\n')
      })).messages.map(String),
      [
        '~/README.md:3:1-3:21: Expected `table-of-contents` before `license` (1:1-1:11)',
        '~/README.md:5:1-5:12: Expected `security` before `license` (1:1-1:11)',
        '~/README.md:7:1-7:14: Expected `background` before `license` (1:1-1:11)',
        '~/README.md:9:1-9:11: Expected `install` before `license` (1:1-1:11)',
        '~/README.md:11:1-11:9: Expected `usage` before `license` (1:1-1:11)',
        '~/README.md:13:1-13:7: Expected `api` before `license` (1:1-1:11)',
        '~/README.md:15:1-15:15: Expected `maintainers` before `license` (1:1-1:11)',
        '~/README.md:17:1-17:16: Expected `contributing` before `license` (1:1-1:11)'
      ],
      'not ok for a section moved entirely upwards'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '## Security',
          '## Background',
          '## Install',
          '## Usage',
          '## API',
          '## Maintainers',
          '## Contributing',
          '## License',
          '## Table of Contents'
        ].join('\n\n')
      })).messages.map(String),
      ['~/README.md:17:1-17:21: Expected `table-of-contents` before `security` (1:1-1:12)'],
      'not ok for a section moved entirely downwards'
    )

    st.deepEqual(
      processor.processSync(vfile({
        path: '~/README.md',
        contents: [
          '## License',
          '## Contributing',
          '## Maintainers',
          '## API',
          '## Usage',
          '## Install',
          '## Background',
          '## Security',
          '## Table of Contents'
        ].join('\n\n')
      })).messages.map(String),
      [
        '~/README.md:17:1-17:21: Expected `table-of-contents` before `license` (1:1-1:11)',
        '~/README.md:15:1-15:12: Expected `security` before `license` (1:1-1:11)',
        '~/README.md:13:1-13:14: Expected `background` before `license` (1:1-1:11)',
        '~/README.md:11:1-11:11: Expected `install` before `license` (1:1-1:11)',
        '~/README.md:9:1-9:9: Expected `usage` before `license` (1:1-1:11)',
        '~/README.md:7:1-7:7: Expected `api` before `license` (1:1-1:11)',
        '~/README.md:5:1-5:15: Expected `maintainers` before `license` (1:1-1:11)',
        '~/README.md:3:1-3:16: Expected `contributing` before `license` (1:1-1:11)'
      ],
      'not ok for all sections inverted'
    )

    st.end()
  })

  t.end()
})
