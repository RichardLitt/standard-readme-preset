var rule = require('unified-lint-rule')
var position = require('unist-util-position')
var schema = require('../util/schema')

module.exports = rule('standard-readme:require-sections', requireSections)

/* Max allowed file-size without a table of contents. */
var maxLinesWithoutTableOfContents = 100

/* Pretty heading names people *should* use. */
var pretty = {
  'table-of-contents': 'Table of Contents',
  install: 'Install',
  usage: 'Usage',
  contribute: 'Contribute',
  license: 'License'
}

var alwaysRequired = [
  'contribute',
  'license'
]

function requireSections (ast, file, options) {
  var sections = schema(ast)
  var required = alwaysRequired.concat()
  var settings = options || {}

  if (settings.toc === null || settings.toc === undefined ? inferToc(ast, sections) : settings.toc) {
    required.push('table-of-contents')
  }

  if (settings.installable) {
    required.push('install', 'usage')
  }

  sections = sections.map(id)
  required.forEach(check)

  function check (slug) {
    if (sections.indexOf(slug) === -1) {
      file.message('Missing required `' + pretty[slug] + '` section')
    }
  }
}

function inferToc (tree, sections) {
  var lines = position.end(tree).line
  var length = sections.length
  var index = -1
  var section
  var end

  while (++index < length) {
    section = sections[index]

    if (section.id === 'table-of-contents') {
      end = index === length - 1 ? section.node : sections[index + 1].node
      lines -= position.end(end).line - position.start(section.node).line
    }
  }

  return lines > maxLinesWithoutTableOfContents
}

function id (info) {
  return info.id
}
