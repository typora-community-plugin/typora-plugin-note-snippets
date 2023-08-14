const reWhitespace = /\s/g

export function pasreSnippets(text: string) {

  text = text.trim()
    .replace(/^(-{3,}).+?\1/m, '')

  let pos = 0
  let name = ''
  const results = {} as Record<string, string>

  while (pos < text.length) {
    if (reWhitespace.test(text[pos])) {
      pos++
      continue
    }
    else if (text[pos] === '`' && text.slice(pos, pos + 3) === '```') {
      const start = text.indexOf('\n', pos) + 1
      const fenceLen = text.slice(pos, start).lastIndexOf('`') + 1
      const end = text.indexOf('`'.repeat(fenceLen), start) - 1
      results[name] = text.slice(start, end)
      pos = end + fenceLen + /* '\n'.length */ 1
      continue
    }
    else {
      const end = text.indexOf('\n', pos)
      name = text.slice(pos, end)
      pos = end + 1
    }
  }

  return results
}
