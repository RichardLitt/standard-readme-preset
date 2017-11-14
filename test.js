var test = require('tape')
var remark = require('remark')
var vfile = require('vfile')
var lint = require('remark-lint')
var fileStem = require('./rules/file-stem')
var fileExtension = require('./rules/file-extension')
var requireFileExtension = require('./rules/require-file-extension')

test('standard-readme', function (t) {
  t.test('file-stem', function (st) {
    var processor = remark().use(lint).use(fileStem)

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.md'})).messages.map(String),
      [],
      'ok for `README.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.mkd'})).messages.map(String),
      [],
      'ok for `README.mkd`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.de.md'})).messages.map(String),
      [],
      'ok for `README.de.md`, an internationalized README with a language tag'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.nl-BE.md'})).messages.map(String),
      [],
      'ok for `README.nl-BE.md`, an internationalized README with a language tag and region tag'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/readme.md'})).messages.map(String),
      ['~/readme.md:1:1: Expected `README` instead of `readme` as file name'],
      'not ok for `readme.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/CONTRIBUTING.md'})).messages.map(String),
      ['~/CONTRIBUTING.md:1:1: Expected `README` instead of `CONTRIBUTING` as file name'],
      'not ok for `CONTRIBUTING.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/readme.de.md'})).messages.map(String),
      ['~/readme.de.md:1:1: Expected `README` instead of `readme` as file name'],
      'not ok for `readme.de.md`, an internationalized README with a language tag'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/readme.nl-BE.md'})).messages.map(String),
      ['~/readme.nl-BE.md:1:1: Expected `README` instead of `readme` as file name'],
      'not ok for `readme.nl-BE.md`, an internationalized README with a language tag and region tag'
    )

    st.end()
  })

  t.test('file-extension', function (st) {
    var processor = remark().use(lint).use(fileExtension)

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.md'})).messages.map(String),
      [],
      'ok for `README.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/README'})).messages.map(String),
      [],
      'ok for `README`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/contributing.md'})).messages.map(String),
      [],
      'ok for `contributing.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/readme.mkd'})).messages.map(String),
      ['~/readme.mkd:1:1: Expected `md` instead of `mkd` as extension'],
      'not ok for `readme.mkd`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.markdown'})).messages.map(String),
      ['~/README.markdown:1:1: Expected `md` instead of `markdown` as extension'],
      'not ok for `README.markdown`'
    )

    st.end()
  })

  t.test('require-file-extension', function (st) {
    var processor = remark().use(lint).use(requireFileExtension)

    st.deepEqual(
      processor.processSync(vfile({path: '~/README.md'})).messages.map(String),
      [],
      'ok for `README.md`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/contributing.mkd'})).messages.map(String),
      [],
      'ok for `contributing.mkd`'
    )

    st.deepEqual(
      processor.processSync(vfile({path: '~/README'})).messages.map(String),
      ['~/README:1:1: Expected file extension'],
      'not ok for `README`'
    )

    st.end()
  })

  t.end()
})
