var rule = require('unified-lint-rule')
var isReadme = require('../util/is-readme')

module.exports = rule('standard-readme:file-stem', fileStem)

var expected = 'README'

function fileStem (ast, file) {
  if (!isReadme(file)) {
    return
  }

  var actual = file.stem.split('.')[0]

  if (actual !== expected) {
    file.message('Expected `' + expected + '` instead of `' + actual + '` as file name')
  }
}
