# Typora Plugin Note Snippets

[English](https://github.com/typora-community-plugin/typora-plugin-note-snippets#README.md) | 简体中文

这是一个基于 [typora-community-plugin](https://github.com/typora-community-plugin/typora-community-plugin) 开发的，适用于 [Typora](https://typora.io) 的插件。

使用斜线指令输入笔记片段。

## 预览

![](/docs/assets/base.jpg)

## 使用

1. 打开“插件设置”对话框 → “Note Snippets” 插件设置 → “笔记片段文件夹” → 点击“打开文件夹”按钮打开**笔记片段文件夹**。

2. (可选) 添加 JavaScript ESM 文件到 **笔记片段文件夹**

```js
// function.js (或其他文件名)
export function author() {
  return 'Tom'
}
```

3. 添加笔记片段 `snippets.md` (或其他文件名) 到 **笔记片段文件夹**

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
