var rule = require('unified-lint-rule')
var isReadme = require('../util/is-readme')

module.exports = rule('standard-readme:require-file-extension', requireFileExtension)

function requireFileExtension (ast, file) {
  if (!isReadme(file)) {
    return
  }

  if (file.extname === '') {
    file.message('Expected file extension')
  }
}
