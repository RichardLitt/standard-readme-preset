var rule = require('unified-lint-rule')
var position = require('unist-util-position')
var stringify = require('unist-util-stringify-position')
var schema = require('../util/schema')

module.exports = rule('standard-readme:no-unknown-sections', noUnknownSections)

var head = [
  'table-of-contents',
  'security',
  'background',
  'install',
  'usage'
]

var tail = [
  'api',
  'maintainer',
  'maintainers',
  'contributing',
  'license'
]

function noUnknownSections (ast, file) {
  var sections = schema(ast)
  var length = sections.length
  var index = -1
  var state = 'head'
  var customPosition
  var tailStart
  var inHead
  var inTail
  var section

  while (++index < length) {
    section = sections[index]
    inHead = head.indexOf(section.id) !== -1
    inTail = tail.indexOf(section.id) !== -1

    if (state === 'head') {
      if (!inHead) {
        if (inTail) {
          state = 'tail'
          tailStart = position.start(section.node)
        } else {
          state = 'custom'
          customPosition = { start: position.start(section.node) }
        }
      }
    } else if (state === 'tail') {
      if (!inTail) {
        if (customPosition) {
          file.message('Unexpected unknown heading in tail: move it to the extra sections (' + stringify(customPosition) + ')', section.node)
        } else {
          file.message('Unexpected unknown section in tail: move it in front of the tail (' + stringify(tailStart) + ')', section.node)
        }
      }
    } else {
      customPosition.end = {
        line: position.end(section.node).line - 1,
        column: 1
      }

      if (inTail) {
        state = 'tail'
        tailStart = position.start(section.node)
      } else if (inHead) {
        /* We had a custom section, and now there’s an entry that should’ve
         * been in the head. Suggest switching them around. */
        file.message('Unexpected header section after extra sections (' + stringify(customPosition) + '): move it in front of the extra sections', section.node)
      }
    }
  }
}
