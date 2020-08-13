exports.plugins = [
  [require('remark-lint-appropriate-heading'), ['error']],
  [require('./rules/file-stem'), ['error']],
  [require('./rules/file-extension'), ['error']],
  [require('./rules/require-file-extension'), ['error']],
  [require('./rules/no-unknown-sections'), ['error']],
  [require('./rules/require-sections'), ['error']],
  [require('./rules/section-order'), ['error']]
]
