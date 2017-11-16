var rule = require('unified-lint-rule')
// var position = require('unist-util-position')
var stringify = require('unist-util-stringify-position')
var schema = require('../util/schema')

module.exports = rule('standard-readme:section-order', sectionOrder)

var order = [
  'table-of-contents',
  'security',
  'background',
  'install',
  'usage',
  'api',
  /* Note: maintainer and maintainers don’t matter in this case... */
  'maintainer',
  'maintainers',
  'contribute',
  'license'
]

function sectionOrder (ast, file) {
  var sections = schema(ast)
  var byId = {}
  var length = sections.length
  var index = -1
  var actual = []
  var expected
  var section
  var id
  var alt
  var idx

  /* First, get all sections usd in the document. */
  while (++index < length) {
    section = sections[index]
    id = section.id

    if (order.indexOf(id) !== -1) {
      actual.push(id)
      byId[id] = section.node
    }
  }

  /* Find the expected order for the used headings. */
  expected = actual.concat().sort(sort)

  /* Check if that’s used! */
  length = expected.length
  index = -1

  while (++index < length) {
    id = expected[index]
    alt = actual[index]

    if (id !== alt) {
      file.message('Expected `' + id + '` before `' + alt + '` (' + stringify(byId[alt]) + ')', byId[id])

      /* Apply the change. */
      idx = actual.indexOf(id)

      actual.splice(index, 0, id) /* Insert. */
      actual.splice(idx + 1, 1) /* Remove. */
    }
  }
}

function sort (a, b) {
  return order.indexOf(a) - order.indexOf(b)
}
