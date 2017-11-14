var rule = require('unified-lint-rule')

module.exports = rule('standard-readme:require-file-extension', requireFileExtension)

function requireFileExtension (ast, file) {
  if (file.extname === '') {
    file.message('Expected file extension')
  }
}
