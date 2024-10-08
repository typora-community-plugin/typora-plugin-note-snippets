import { fs, path, Plugin, TextSuggest, App, PluginSettings } from '@typora-community-plugin/core'
import { NoteSnippetsSettingTab } from './setting-tab'
import { getDefaultSettings, NoteSnippetsSettings } from './settings'
import { pasreSnippets } from './parse-snippets'


export default class NoteSnippetsPlugin extends Plugin<NoteSnippetsSettings> {

  suggest = new NoteSnippetSuggest(this.app, this)

  onload() {
    this.registerSettings(
      new PluginSettings(this.app, this.manifest, {
        version: 1,
      }))

    this.settings.setDefault(
      getDefaultSettings(this.app.config.isUsingGlobalConfig)
    )

    this.suggest._loadCodeSnippets()

    this.register(
      this.app.vault.on('mounted', () =>
        this.suggest._loadCodeSnippets()))

    this.register(
      this.app.workspace.activeEditor.suggestion.register(
        this.suggest
      ))

    this.registerSettingTab(new NoteSnippetsSettingTab(this.app, this))
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

  get snippetsRoot() {
    return this.app.config.isUsingGlobalConfig
      ? this.app.config.configDir
      : this.app.vault.path
  }

  get snippetsDir() {
    return path.join(this.snippetsRoot, this.plugin.settings.get('snippetsDir'))
  }

  _loadCodeSnippets() {
    const { snippetsDir } = this

    return fs.access(snippetsDir)
      .then(() => fs.list(snippetsDir))
      .then(async files => [
        await Promise.all(
          files.filter(file => file.endsWith('.js'))
            .map(file => import(path.join(snippetsDir, file)))
        ),
        await Promise.all(
          files.filter(file => file.endsWith('.md'))
            .map(file => fs.readText(path.join(snippetsDir, file)))
        ),
      ])
      .then(([modules, texts]) => {
        this.module = modules.reduce((o, module) => Object.assign(o, module), {})

        this.snippets = texts.reduce((o, text) => Object.assign(o, pasreSnippets(text)), {})

        this.suggestions = Object.keys(this.snippets)
      })
      .catch(() => {
        this.module = {}
        this.snippets = {}
        this.suggestions = []
      })
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
