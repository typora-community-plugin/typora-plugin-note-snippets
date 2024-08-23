import { JSBridge } from "typora"
import { App, I18n, Notice, SettingTab } from "@typora-community-plugin/core"
import type NoteSnippetsPlugin from "./main"
import { getDefaultSettings } from "./settings"


export class NoteSnippetsSettingTab extends SettingTab {

  get name() {
    return 'Note Snippets'
  }

  i18n = new I18n({
    resources: {
      'en': {
        snippetFolder: 'Note snippets folder',
        snippetFolderDesc: 'The folder includes any markdown file. A paragraph and a codeblock as one pair (sugget key and snippet), a markdown file contains one or more pair.',
        open: 'Open folder',
        reload: 'Reload',
        reloadedMsg: 'Note snippets load successfully.',
      },
      'zh-cn': {
        snippetFolder: '笔记片段文件夹',
        snippetFolderDesc: '该文件夹包含任意数量 Markdown 文件。一行文本和一个代码块作为一个片段对（提示词和笔记片段），一个 Markdown 文件包含一个或多个片段对。',
        open: '打开文件夹',
        reload: '重新加载',
        reloadedMsg: '笔记片段加载成功。',
      },
    }
  })

  constructor(
    private app: App,
    private plugin: NoteSnippetsPlugin
  ) {
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
        const DEFAULT_SETTINGS = getDefaultSettings(this.app.config.isUsingGlobalConfig)
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
      setting.addButton(button => {
        button.classList.add('primary')
        button.innerHTML = '<span class="fa fa-folder-o"></span>'
        button.title = t.open
        button.onclick = () => {
          JSBridge.invoke("shell.openItem", this.plugin.suggest.snippetsDir)
        }
      })
    })

    super.show()
  }
}
