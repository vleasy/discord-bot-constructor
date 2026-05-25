export interface Project {
  id: string
  name: string
  token: string
  prefix: string
  createdAt: number
  updatedAt: number
  config?: {
    token: string
    prefix: string
    intents: string[]
    status: { type: string; text: string }
  }
  modules?: string[]
  status?: string
}

export interface SaveData {
  project: Project
  nodes: any[]
  edges: any[]
}
