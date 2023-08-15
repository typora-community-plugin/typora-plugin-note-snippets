import * as fs from 'fs/promises'
import * as path from 'path'
import * as _ from 'lodash'
import { Plugin, EditorSuggest, App } from '@typora-community-plugin/core'
import { NoteSnippetsSettingTab } from './setting-tab'
import { DEFAULT_SETTINGS, NoteSnippetsSettings } from './settings'
import { pasreSnippets } from './parse-snippets'


export default class NoteSnippetsPlugin extends Plugin {

  settings: NoteSnippetsSettings

  suggest = new NoteSnippetSuggest(this.app, this)

  onload() {
    this.register(
      this.app.vault.on('mounted', async () => {
        await this.loadSettings()
        this.suggest._loadCodeSnippets()
      }))

    this.register(
      this.app.workspace.activeEditor.suggestion.register(
        this.suggest
      ))

    this.registerSettingTab(new NoteSnippetsSettingTab(this))
  }

  onunload() {
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}

class NoteSnippetSuggest extends EditorSuggest<string> {

  suggestionKeys: string[] = []
  snippets: Record<string, string> = {}
  module: Record<string, any> = {}

  constructor(private app: App, private plugin: NoteSnippetsPlugin) {
    super()
  }

  _loadCodeSnippets() {
    const vaultPath = this.app.vault.path
    const snippetsPath = path.join(vaultPath, this.plugin.settings.snippetsDir)

    return fs.access(snippetsPath)
      .then(() => fs.readdir(snippetsPath))
      .then(async files => [
        await Promise.all(
          files.filter(file => file.endsWith('.js'))
            .map(file => import(path.join(snippetsPath, file)))
        ),
        await Promise.all(
          files.filter(file => file.endsWith('.md'))
            .map(file => fs.readFile(path.join(snippetsPath, file), 'utf8'))
        ),
      ])
      .then(([modules, texts]) => {
        this.module = modules.reduce((o, module) => Object.assign(o, module), {})

        this.snippets = texts.reduce((o, text) => Object.assign(o, pasreSnippets(text)), {})

        this.suggestionKeys = Object.keys(this.snippets)
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

  getSuggestions(query: string) {
    return this.suggestionKeys.filter(n => n.includes(query))
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