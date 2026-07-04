var toString = require('mdast-util-to-string')
var slugs = require('github-slugger')()
var sep = require('path').sep

module.exports = matchesAlias

// Standard Readme allows a Title heading which does not match the directory,
// repository, or package name, as long as that name is given as a trailing,
// parenthesized alias, e.g. `# Standard Readme Style _(standard-readme)_`.
// This checks for that alias and whether it matches the directory name.
var ALIAS = /\(([^()]+)\)\s*$/

function matchesAlias (tree, file) {
  var heading = firstHeading(tree)

  if (!heading) {
    return false
  }

  var match = ALIAS.exec(toString(heading).trim())

  if (!match) {
    return false
  }

  var alias = match[1].trim().toLowerCase()
  var dirnames = (file.dirname === '.' ? file.cwd : file.dirname).split(sep)
  var expected = dirnames.slice(-1).join('').toLowerCase()
  var expectedScoped = dirnames.slice(-2).join('/').toLowerCase()

  slugs.reset()

  return (
    alias === expected ||
    alias === expectedScoped ||
    slugs.slug(alias) === expected
  )
}

function firstHeading (tree) {
  var children = tree.children
  var length = children.length
  var index = -1

  while (++index < length) {
    if (children[index].type === 'heading') {
      return children[index]
    }
  }

  return null
}
