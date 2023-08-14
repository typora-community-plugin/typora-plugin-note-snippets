# Typora Plugin Note Snippets

English | [简体中文](https://github.com/typora-community-plugin/typora-plugin-note-snippets/blob/main/README.zh-CN.md)

This a plugin based on [typora-community-plugin](https://github.com/typora-community-plugin/typora-community-plugin) for [Typora](https://typora.io).

Use slash command to autocomplete note snippets.

## Preview

![](https://fastly.jsdelivr.net/gh/typora-community-plugin/typora-plugin-note-snippets@main/docs/assets/base.jpg)

## Usage

(Optional) Add JavaScript ESM file to `.typora/snippets` folder

```js
// function.js (or other name)
export function author() {
  return 'Tom'
}
```

Add note snippets `snippets.md`(or other name) to `.typora/snippets` folder

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
