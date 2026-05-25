import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  saveProject: (data: string) => ipcRenderer.invoke('dialog:save-json', data),
  openProject: () => ipcRenderer.invoke('dialog:open-project'),
  onMenuNewProject: (cb: () => void) => ipcRenderer.on('menu:new-project', cb),
  onMenuSave: (cb: () => void) => ipcRenderer.on('menu:save', cb),
  onMenuUndo: (cb: () => void) => ipcRenderer.on('menu:undo', cb),
  onMenuRedo: (cb: () => void) => ipcRenderer.on('menu:redo', cb),
  onFileOpen: (cb: (content: string) => void) => ipcRenderer.on('file:open', (_e, content) => cb(content)),
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),

  project: {
    list: () => ipcRenderer.invoke('project:list'),
    get: (id: string) => ipcRenderer.invoke('project:get', id),
    create: (name: string) => ipcRenderer.invoke('project:create', name),
    save: (project: any) => ipcRenderer.invoke('project:save', project),
    delete: (id: string) => ipcRenderer.invoke('project:delete', id)
  },
  bot: {
    generate: (project: any) => ipcRenderer.invoke('bot:generate', project),
    start: (project: any) => ipcRenderer.invoke('bot:start', project),
    stop: (projectId: string) => ipcRenderer.invoke('bot:stop', projectId),
    status: (projectId: string) => ipcRenderer.invoke('bot:status', projectId),
    onLog: (callback: (data: any) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, data: any) => callback(data)
      ipcRenderer.on('bot:log', handler)
      return () => ipcRenderer.removeListener('bot:log', handler)
    }
  }
})
