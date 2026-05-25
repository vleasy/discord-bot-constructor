import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import type { Project } from '../renderer/src/types/index'

const projectsDir = path.join(app.getPath('userData'), 'projects')

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function getProjectPath(id: string): string {
  return path.join(projectsDir, `${id}.json`)
}

export function initProjectsDir(): void {
  ensureDir(projectsDir)
}

export function listProjects(): Project[] {
  ensureDir(projectsDir)
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.json'))
  return files.map((f) => {
    const data = fs.readFileSync(path.join(projectsDir, f), 'utf-8')
    return JSON.parse(data) as Project
  })
}

export function getProject(id: string): Project | null {
  const filePath = getProjectPath(id)
  if (!fs.existsSync(filePath)) return null
  const data = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(data) as Project
}

export function createProject(name: string): Project {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const project: Project = {
    id,
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    config: {
      token: '',
      prefix: '!',
      intents: ['Guilds', 'GuildMessages', 'MessageContent'],
      status: { type: 'playing', text: '!help' }
    },
    modules: [],
    status: 'offline'
  }
  saveProject(project)
  return project
}

export function saveProject(project: Project): void {
  ensureDir(projectsDir)
  project.updatedAt = Date.now()
  const filePath = getProjectPath(project.id)
  fs.writeFileSync(filePath, JSON.stringify(project, null, 2), 'utf-8')
}

export function deleteProject(id: string): void {
  const filePath = getProjectPath(id)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
  const projectDir = path.join(app.getPath('userData'), 'generated', id)
  if (fs.existsSync(projectDir)) {
    fs.rmSync(projectDir, { recursive: true })
  }
}
