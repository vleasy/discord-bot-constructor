import { ipcMain, BrowserWindow } from 'electron'
import { listProjects, getProject, createProject, saveProject, deleteProject } from './project-manager'
import { generateBotCode, startBot, stopBot, isBotRunning } from './bot-manager'
import type { Project } from '../renderer/src/types/index'

export function setupIPC(mainWindow: BrowserWindow): void {
  ipcMain.handle('project:list', () => {
    return listProjects()
  })

  ipcMain.handle('project:get', (_event, id: string) => {
    return getProject(id)
  })

  ipcMain.handle('project:create', (_event, name: string) => {
    return createProject(name)
  })

  ipcMain.handle('project:save', (_event, project: Project) => {
    saveProject(project)
    return true
  })

  ipcMain.handle('project:delete', (_event, id: string) => {
    deleteProject(id)
    return true
  })

  ipcMain.handle('bot:generate', (_event, project: Project) => {
    generateBotCode(project)
    return true
  })

  ipcMain.handle('bot:start', (_event, project: Project) => {
    return startBot(project, (text, type) => {
      mainWindow.webContents.send('bot:log', { projectId: project.id, text, type, timestamp: Date.now() })
    })
  })

  ipcMain.handle('bot:stop', (_event, projectId: string) => {
    return stopBot(projectId)
  })

  ipcMain.handle('bot:status', (_event, projectId: string) => {
    return isBotRunning(projectId)
  })
}
