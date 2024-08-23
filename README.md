# Typora Plugin Note Snippets

English | [简体中文](https://github.com/typora-community-plugin/typora-plugin-note-snippets/blob/main/README.zh-CN.md)

This a plugin based on [typora-community-plugin](https://github.com/typora-community-plugin/typora-community-plugin) for [Typora](https://typora.io).

Use slash command to autocomplete note snippets.

## Preview

![](/docs/assets/base.jpg)

## Usage

1. Open "Plugin Settings" Modal → Plugin "Note Snippets" Settings → "Note snippets folder" → click "Open folder" button to open **the snippets folder**.

2. (Optional) Add JavaScript ESM file to **the snippets folder**

```js
// function.js (or other name)
export function author() {
  return 'Tom'
}
```

3. Add note snippets `snippets.md`(or other name) to **the snippets folder**

````markdown
key

```markdown
hello world
```

key2

```markdown
hello {{ author() }}
```
````

Use slash command in Typora, like `/key2`. It will replace with `hello Tom`.
