import { JSBridge } from "typora"
import { App, fs, I18n, Notice, SettingTab } from "@typora-community-plugin/core"
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
        snippetFolderDesc: '- The folder includes any markdown file. A paragraph and a codeblock as one pair (sugget key and snippet), a markdown file contains one or more pair.\n - Reload button: reload snippets from folder, after changed path or files in it.\n - Open folder button: open snippets folder to add snippet files.',
        open: 'Open folder',
        reload: 'Reload',
        reloadedSuccessMsg: 'Note snippets load successfully.',
        reloadedEmptyMsg: 'No note snippets be found.',
      },
      'zh-cn': {
        snippetFolder: '笔记片段文件夹',
        snippetFolderDesc: '- 该文件夹包含任意数量 Markdown 文件，一个 Markdown 文件包含一个或多个片段对，一行文本和一个多行代码块作为一个片段对（即提示词和笔记片段）。\n - 重新加载按钮：手动从文件夹中重新加载笔记片段，适用于修改了文件夹路径或编辑了笔记片段文件。\n - 打开文件夹按钮：打开笔记片段文件夹以添加笔记片段文件',
        open: '打开文件夹',
        reload: '重新加载',
        reloadedSuccessMsg: '笔记片段加载成功。',
        reloadedEmptyMsg: '没有找到任何笔记片段。',
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
            .then(() => {
              if (plugin.suggest.suggestions.length)
                new Notice(t.reloadedSuccessMsg)
              else
                new Notice(t.reloadedEmptyMsg)
            })
      })
      setting.addButton(button => {
        button.classList.add('primary')
        button.innerHTML = '<span class="fa fa-folder-o"></span>'
        button.title = t.open
        button.onclick = () => {
          const { snippetsDir } = this.plugin.suggest
          fs.access(snippetsDir)
            .catch(() => fs.mkdir(snippetsDir))
            .then(() => JSBridge.invoke("shell.openItem", snippetsDir))
        }
      })
    })

    super.show()
  }
}
