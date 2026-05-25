import { create } from 'zustand'
import type { Node, Edge } from '@xyflow/react'
import { useEditorStore } from './editorStore'

interface ProjectState {
  showExportDialog: boolean
  showCodePreview: boolean
  toggleExportDialog: () => void
  toggleCodePreview: () => void
  saveProject: (nodes: Node[], edges: Edge[]) => Promise<void>
  exportPlugin: (code: string, ext: string) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set) => ({
  showExportDialog: false,
  showCodePreview: false,

  toggleExportDialog: () => set((s) => ({ showExportDialog: !s.showExportDialog })),
  toggleCodePreview: () => set((s) => ({ showCodePreview: !s.showCodePreview })),

  saveProject: async (nodes, edges) => {
    const { projectName, botToken, botPrefix } = useEditorStore.getState()
    const data = JSON.stringify({ project: { name: projectName, token: botToken, prefix: botPrefix }, nodes, edges }, null, 2)

    if (window.electronAPI?.project?.save) {
      await window.electronAPI.project.save({
        id: 'current',
        name: projectName,
        config: { token: botToken, prefix: botPrefix, intents: ['Guilds', 'GuildMessages', 'MessageContent'], status: { type: 'playing', text: '!help' } },
        modules: [],
        status: 'offline',
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
    } else {
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectName}.dubot.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  },

  exportPlugin: async (code, _ext) => {
    if (window.electronAPI?.saveProject) {
      await window.electronAPI.saveProject(code)
    } else {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bot.js'
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}))
