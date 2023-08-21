import { I18n, Notice, SettingTab } from "@typora-community-plugin/core"
import type NoteSnippetsPlugin from "./main"
import { DEFAULT_SETTINGS } from "./settings"


export class NoteSnippetsSettingTab extends SettingTab {

  get name() {
    return 'Note Snippets'
  }

  i18n = new I18n({
    resources: {
      'en': {
        snippetFolder: 'Note snippets folder',
        snippetFolderDesc: 'The folder includes any markdown file. A paragraph and a codeblock as one pair (sugget key and snippet), a markdown file contains one or more pair.',
        reload: 'Reload',
        reloadedMsg: 'Note snippets load successfully.',
      },
      'zh-cn': {
        snippetFolder: '笔记片段文件夹',
        snippetFolderDesc: '该文件夹包含任意数量 Markdown 文件。一行文本和一个代码块作为一个片段对（提示词和笔记片段），一个 Markdown 文件包含一个或多个片段对。',
        reload: '重新加载',
        reloadedMsg: '笔记片段加载成功。',
      },
    }
  })

  constructor(private plugin: NoteSnippetsPlugin) {
    super()
  }

  show() {
    const { plugin } = this
    const { t } = this.i18n

    this.containerEl.innerHTML = ''

    this.addSetting(setting => {
      setting.addName(t.snippetFolder)
      setting.addDescription(t.snippetFolderDesc)
      setting.addText(input => {
        input.value = plugin.settings.get('snippetsDir')
        input.placeholder = DEFAULT_SETTINGS.snippetsDir
        input.oninput = () => {
          plugin.settings.set('snippetsDir', input.value ?? DEFAULT_SETTINGS.snippetsDir)
        }
      })
      setting.addButton(button => {
        button.classList.add('primary')
        button.innerHTML = '<span class="fa fa-refresh"></span>'
        button.title = t.reload
        button.onclick = () =>
          this.plugin.suggest._loadCodeSnippets()
            .then(() => new Notice(t.reloadedMsg))
      })
    })

    super.show()
  }
}
