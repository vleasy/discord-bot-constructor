import type { Node, Edge } from '@xyflow/react'

export interface Template {
  id: string
  name: string
  description: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
  nodes: Node[]
  edges: Edge[]
}

export const templates: Template[] = [
  {
    id: 'ping_pong',
    name: 'Ping-Pong Command',
    description: 'Simple ping command that responds with latency',
    icon: 'message-circle',
    difficulty: 'easy',
    nodes: [
      {
        id: 'n1', type: 'blockNode',
        position: { x: 50, y: 200 },
        data: { definitionId: 'on_command', properties: { command_name: 'ping', aliases: 'p' } }
      },
      {
        id: 'n2', type: 'blockNode',
        position: { x: 350, y: 200 },
        data: { definitionId: 'reply', properties: { text: '🏓 Pong!', mention: false } }
      }
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', sourceHandle: 'output', targetHandle: 'input', type: 'discordEdge' }
    ]
  },
  {
    id: 'welcome',
    name: 'Welcome Message',
    description: 'Sends a welcome embed when someone joins',
    icon: 'log-in',
    difficulty: 'easy',
    nodes: [
      {
        id: 'n1', type: 'blockNode',
        position: { x: 50, y: 200 },
        data: { definitionId: 'on_join', properties: {} }
      },
      {
        id: 'n2', type: 'blockNode',
        position: { x: 350, y: 200 },
        data: { definitionId: 'create_embed', properties: { title: 'Welcome!', description: 'Welcome {{user}} to the server! 🎉', color: '#6366f1', footer: 'Auto welcome' } }
      }
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', sourceHandle: 'output', targetHandle: 'input', type: 'discordEdge' }
    ]
  },
  {
    id: 'mod_tools',
    name: 'Basic Moderation',
    description: 'Kick and timeout commands with permission checks',
    icon: 'shield',
    difficulty: 'medium',
    nodes: [
      {
        id: 'n1', type: 'blockNode',
        position: { x: 50, y: 150 },
        data: { definitionId: 'on_command', properties: { command_name: 'kick', aliases: '' } }
      },
      {
        id: 'n2', type: 'blockNode',
        position: { x: 50, y: 350 },
        data: { definitionId: 'on_command', properties: { command_name: 'timeout', aliases: 'mute' } }
      },
      {
        id: 'n3', type: 'blockNode',
        position: { x: 350, y: 150 },
        data: { definitionId: 'has_permission', properties: { permission: 'kick_members', target: 'author' } }
      },
      {
        id: 'n4', type: 'blockNode',
        position: { x: 650, y: 100 },
        data: { definitionId: 'kick', properties: { target: 'mentioned', reason: '{{reason}}' } }
      },
      {
        id: 'n5', type: 'blockNode',
        position: { x: 650, y: 200 },
        data: { definitionId: 'reply', properties: { text: '❌ No permission!', mention: false } }
      },
      {
        id: 'n6', type: 'blockNode',
        position: { x: 350, y: 350 },
        data: { definitionId: 'timeout', properties: { target: 'mentioned', duration: 60, reason: '{{reason}}' } }
      }
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n3', sourceHandle: 'output', targetHandle: 'input', type: 'discordEdge' },
      { id: 'e2', source: 'n3', target: 'n4', sourceHandle: 'branch-true', targetHandle: 'input', type: 'discordEdge' },
      { id: 'e3', source: 'n3', target: 'n5', sourceHandle: 'branch-false', targetHandle: 'input', type: 'discordEdge' },
      { id: 'e4', source: 'n2', target: 'n6', sourceHandle: 'output', targetHandle: 'input', type: 'discordEdge' }
    ]
  }
]
