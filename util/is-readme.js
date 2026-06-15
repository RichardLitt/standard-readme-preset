module.exports = isReadme

function isReadme (file) {
  return file.stem && file.stem.split('.')[0].toLowerCase() === 'readme'
}
