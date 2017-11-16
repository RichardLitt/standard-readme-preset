exports.plugins = [
  require('remark-lint-appropriate-heading'),
  require('./rules/file-stem'),
  require('./rules/file-extension'),
  require('./rules/require-file-extension'),
  require('./rules/no-unknown-sections'),
  require('./rules/require-sections'),
  require('./rules/section-order')
]
