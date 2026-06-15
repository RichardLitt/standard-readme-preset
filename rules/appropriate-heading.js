var appropriateHeading = require('remark-lint-appropriate-heading')
var isReadme = require('../util/is-readme')

module.exports = readmeAppropriateHeading
readmeAppropriateHeading.displayName = appropriateHeading.displayName

function readmeAppropriateHeading (options) {
  var transformer = appropriateHeading(options)

  /* istanbul ignore if - only happens when the rule is disabled. */
  if (!transformer) {
    return
  }

  return function transformerForReadmes (ast, file, next) {
    if (isReadme(file)) {
      transformer(ast, file, next)
    } else {
      next()
    }
  }
}
