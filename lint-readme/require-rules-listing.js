const path = require('path')
const rule = require('unified-lint-rule')
const select = require('unist-util-select')
const preset = require('../index')

module.exports = rule(
  `custom:${path.basename(__filename)}`,
  function lintReadmeRules (ast, file) {
    const rulesList = select.select('heading:has([value="Rules"]) ~ list', ast)
    const rules = select.selectAll('listItem link inlineCode', rulesList)
    const foundRules = rules.map((rule) => rule.value)

    const expectedRules = preset.plugins.map((rule) => rule.displayName)

    foundRules.forEach((rule) => {
      if (!expectedRules.includes(rule)) {
        file.message(`Documented rule "${rule}" in README.md is not included in preset.`)
      }
    })

    expectedRules.forEach((rule) => {
      if (!foundRules.includes(rule)) {
        file.message(`Included rule "${rule}" in preset is not documented in README.md.`)
      }
    })
  }
)
