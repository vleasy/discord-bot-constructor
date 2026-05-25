/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    saveProject: (data: string) => Promise<string | null>
    openProject: () => Promise<string | null>
    onMenuNewProject: (cb: () => void) => void
    onMenuSave: (cb: () => void) => void
    onMenuUndo: (cb: () => void) => void
    onMenuRedo: (cb: () => void) => void
    onFileOpen: (cb: (content: string) => void) => void
    removeAllListeners: (channel: string) => void

    project: {
      list: () => Promise<any[]>
      get: (id: string) => Promise<any | null>
      create: (name: string) => Promise<any>
      save: (project: any) => Promise<boolean>
      delete: (id: string) => Promise<boolean>
    }
    bot: {
      generate: (project: any) => Promise<boolean>
      start: (project: any) => Promise<boolean>
      stop: (projectId: string) => Promise<boolean>
      status: (projectId: string) => Promise<boolean>
      onLog: (callback: (data: any) => void) => () => void
      deploy: (token: string, commands: any[]) => Promise<{ success: boolean; count?: number; error?: string }>
    }
  }
}
