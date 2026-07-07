import { JSBridge } from "typora"
import { App, fs, I18n, Notice, SettingTab, path } from "@typora-community-plugin/core"
import type NoteSnippetsPlugin from "./main"
import * as Locale from './locales/lang.en.json'
import { getDefaultSettings } from "./settings"


export class NoteSnippetsSettingTab extends SettingTab {

  get name() {
    return 'Note Snippets'
  }

  i18n!: I18n<typeof Locale>

  constructor(
    private app: App,
    private plugin: NoteSnippetsPlugin
  ) {
    super()
    this.i18n = new I18n<typeof Locale>({
      localePath: path.join(plugin.manifest.dir!, 'locales')
    })
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
