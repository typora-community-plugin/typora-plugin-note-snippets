export interface NoteSnippetsSettings {
  snippetsDir: string
}

export function getDefaultSettings(isGlobal: boolean): NoteSnippetsSettings {
  return isGlobal ? DEFAULT_GLOBAL_SETTINGS : DEFAULT_VAULT_SETTINGS
}

export const DEFAULT_GLOBAL_SETTINGS: NoteSnippetsSettings = {
  snippetsDir: 'snippets'
}

export const DEFAULT_VAULT_SETTINGS: NoteSnippetsSettings = {
  snippetsDir: '.typora/snippets'
}
