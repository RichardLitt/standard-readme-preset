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
  let getParagraph

  while (++index < length) {
    node = children[index]

    switch (node.type) {
      case 'heading':
        if (node.depth !== 2) break

        map.push({
          id: slugs.slug(toString(node)),
          node: node
        })

        getParagraph = true
        continue

      case 'paragraph':
        if (getParagraph) {
          map[map.length - 1].paragraph = node
        }
        break
    }

    getParagraph = false
  }

  return map
}
