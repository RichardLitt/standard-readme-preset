var toString = require('mdast-util-to-string')
var slugs = require('github-slugger')()

module.exports = schema

function schema (tree) {
  var map = []
  var children = tree.children
  var length = children.length
  var index = -1
  var node
  var nextNode

  slugs.reset()

  /* Get all headings of level 2 and use slugs as IDs for each heading. */
  while (++index < length) {
    node = children[index]

    if (node.type === 'heading' && node.depth === 2) {
      map.push({
        id: slugs.slug(toString(node)),
        node: node,
        isEmpty: false
      })

      if (index + 1 < length) {
        nextNode = children[index + 1]

        // If the next node is a header level 2, this section is empty
        if (nextNode.type === 'heading' && nextNode.depth === 2) {
          map[map.length - 1].isEmpty = true
        }
      } else {
        // If there is no next node, this section is right before the end of the
        // document, and also empty
        map[map.length - 1].isEmpty = true
      }
    }
  }

  return map
}
