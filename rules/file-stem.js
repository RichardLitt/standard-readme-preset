var rule = require('unified-lint-rule')

module.exports = rule('standard-readme:file-stem', fileStem)

var expected = 'README'

function fileStem (ast, file) {
  var actual = file.stem.split('.')[0]

  if (actual !== expected) {
    file.message('Expected `' + expected + '` instead of `' + actual + '` as file name')
  }
}
