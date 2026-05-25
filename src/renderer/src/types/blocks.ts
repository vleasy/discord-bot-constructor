export type BlockCategory = 'trigger' | 'action' | 'condition' | 'logic'
export type FieldType = 'string' | 'number' | 'boolean' | 'select' | 'channel' | 'role' | 'user' | 'emoji' | 'embed'

export interface FieldDef {
  key: string
  label: string
  type: FieldType
  defaultValue?: any
  placeholder?: string
  description?: string
  options?: { label: string; value: string }[]
}

export interface BlockDefinition {
  id: string
  type: BlockCategory
  label: string
  icon: string
  color: string
  description: string
  tags: string[]
  fields: FieldDef[]
  hasInput: boolean
  hasOutput: boolean
  branches?: string[]
  outputType?: string
}

export interface BlockData {
  definitionId: string
  properties: Record<string, any>
  label?: string
}
