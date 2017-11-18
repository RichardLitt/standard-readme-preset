var toString = require('mdast-util-to-string')
var slugs = require('github-slugger')()

module.exports = schema

function schema (tree) {
  var map = []
  var children = tree.children
  var length = children.length
  var index = -1
  var node

  slugs.reset()

  /* Get all headings of level 2 and use slugs as IDs for each heading. */
  while (++index < length) {
    node = children[index]

    if (node.type === 'heading' && node.depth === 2) {
      map.push({
        id: slugs.slug(toString(node)),
        node: node
      })
    }
  }

  return map
}
