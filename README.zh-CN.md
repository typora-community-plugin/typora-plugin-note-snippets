# Typora Plugin Note Snippets

[English](https://github.com/typora-community-plugin/typora-plugin-note-snippets#README.md) | 简体中文

这是一个基于 [typora-community-plugin](https://github.com/typora-community-plugin/typora-community-plugin) 开发的，适用于 [Typora](https://typora.io) 的插件。

使用斜线指令输入笔记片段。

## 预览

![](https://fastly.jsdelivr.net/gh/typora-community-plugin/typora-plugin-note-snippets@main/docs/assets/base.jpg)

## 使用

(可选) 添加 JavaScript ESM 文件到 `{笔记目录}/.typora/snippets` 文件夹

```js
// function.js (或其他文件名)
export function author() {
  return 'Tom'
}
```

添加笔记片段 `snippets.md` (或其他文件名) 到 `.typora/snippets` 文件夹

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

在 Typora 中使用斜线指令，如 `/key2`，将会使用文本 `hello Tom` 替换输入的指令。
