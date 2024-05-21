import { fs, path, Plugin, TextSuggest, App, PluginSettings } from '@typora-community-plugin/core'
import { NoteSnippetsSettingTab } from './setting-tab'
import { DEFAULT_SETTINGS, NoteSnippetsSettings } from './settings'
import { pasreSnippets } from './parse-snippets'


export default class NoteSnippetsPlugin extends Plugin<NoteSnippetsSettings> {

  suggest = new NoteSnippetSuggest(this.app, this)

  onload() {
    this.registerSettings(
      new PluginSettings(this.app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(DEFAULT_SETTINGS)

    this.suggest._loadCodeSnippets()

    this.register(
      this.app.vault.on('mounted', () =>
        this.suggest._loadCodeSnippets()))

    this.register(
      this.app.workspace.activeEditor.suggestion.register(
        this.suggest
      ))

    this.registerSettingTab(new NoteSnippetsSettingTab(this))
  }
}

class NoteSnippetSuggest extends TextSuggest {

  triggerText = '/'
  suggestions: string[] = []
  snippets: Record<string, string> = {}
  module: Record<string, any> = {}

  constructor(private app: App, private plugin: NoteSnippetsPlugin) {
    super()
  }

  _loadCodeSnippets() {
    const vaultPath = this.app.vault.path
    const snippetsPath = path.join(vaultPath, this.plugin.settings.get('snippetsDir'))

    return fs.access(snippetsPath)
      .then(() => fs.list(snippetsPath))
      .then(async files => [
        await Promise.all(
          files.filter(file => file.endsWith('.js'))
            .map(file => import(path.join(snippetsPath, file)))
        ),
        await Promise.all(
          files.filter(file => file.endsWith('.md'))
            .map(file => fs.readText(path.join(snippetsPath, file)))
        ),
      ])
      .then(([modules, texts]) => {
        this.module = modules.reduce((o, module) => Object.assign(o, module), {})

        this.snippets = texts.reduce((o, text) => Object.assign(o, pasreSnippets(text)), {})

        this.suggestions = Object.keys(this.snippets)
      })
      .catch(() => { })
  }

  findQuery(text: string) {
    const matched = text.match(/(?<!<)[\/、]([^\/、]*)$/) ?? []
    return {
      isMatched: !!matched[0],
      query: matched[1],
    }
  }

  beforeApply(suggest: string) {
    return this.snippets[suggest]
      .replace(/\{\{([^}]+)\}\}/g, (_, val: string) => {
        val = val.trim()
        if (!val.endsWith(')')) return this.module[val]
        const [fn, paramsStr] = val.split(/\(|\)/)
        const params = paramsStr
          ? paramsStr.split(/, */).map(s => JSON.stringify(s))
          : []
        return this.module[fn](...params)
      })
  }
}
