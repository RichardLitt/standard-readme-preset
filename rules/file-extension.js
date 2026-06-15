var rule = require('unified-lint-rule')
var isReadme = require('../util/is-readme')

module.exports = rule('standard-readme:file-extension', fileExtension)

var expected = 'md'

function fileExtension (ast, file) {
  if (!isReadme(file)) {
    return
  }

  var actual = file.extname ? file.extname.slice(1) : ''

  if (actual && actual !== expected) {
    file.message('Expected `' + expected + '` instead of `' + actual + '` as extension')
  }
}
