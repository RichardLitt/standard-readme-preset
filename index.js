exports.plugins = [
  require('remark-lint-appropriate-heading'),
  require('./rules/file-stem'),
  require('./rules/file-extension'),
  require('./rules/require-file-extension')
]
