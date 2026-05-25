import React, { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { getBlockById } from '../data'
import type { BlockCategory } from '../types'
import {
  Zap, Play, GitBranch, Variable, MessageCircle, Terminal, LogIn, LogOut,
  SmilePlus, Volume2, MessageSquare, CornerUpLeft, FileText, UserX, Ban,
  Clock, Shield, ShieldOff, Trash2, Save, Hourglass, Music, Square,
  ShieldCheck, Search, Dice6, Equal, Repeat, TerminalSquare, Power,
  FolderPlus, MousePointer, Database
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  power: Power, 'message-circle': MessageCircle, terminal: Terminal, 'log-in': LogIn,
  'log-out': LogOut, 'smile-plus': SmilePlus, 'volume-2': Volume2,
  'message-square': MessageSquare, 'corner-up-left': CornerUpLeft,
  'file-text': FileText, 'user-x': UserX, ban: Ban, clock: Clock,
  shield: Shield, 'shield-off': ShieldOff, 'trash-2': Trash2, save: Save,
  hourglass: Hourglass, music: Music, square: Square, 'shield-check': ShieldCheck,
  search: Search, 'dice-6': Dice6, equal: Equal, repeat: Repeat,
  'terminal-square': TerminalSquare, zap: Zap, play: Play, 'git-branch': GitBranch,
  variable: Variable, 'mouse-pointer': MousePointer, 'check-circle': ShieldCheck,
  'folder-plus': FolderPlus, database: Database
}

const categoryGradients: Record<BlockCategory, string> = {
  trigger: 'from-amber-500/20 to-amber-500/5',
  action: 'from-cyan-500/20 to-cyan-500/5',
  condition: 'from-red-500/20 to-red-500/5',
  logic: 'from-purple-500/20 to-purple-500/5'
}

function PropertyPreview({ defId, props }: { defId: string; props: Record<string, any> }) {
  const def = getBlockById(defId)
  if (!def) return null
  const displayField = def.fields.find(f => f.key !== 'delay' && f.key !== 'target')
  const val = displayField ? (props[displayField.key] ?? displayField.defaultValue) : null
  if (val === null || val === undefined || val === '') return null
  return (
    <div className="px-2.5 pb-1.5 pt-0.5">
      <div className="text-[10px] text-gray-400/60 bg-white/5 rounded px-1.5 py-0.5 truncate font-mono">
        {String(val).length > 25 ? String(val).slice(0, 25) + '...' : String(val)}
      </div>
    </div>
  )
}

const BlockNode = memo(({ id, data, selected }: NodeProps) => {
  const def = getBlockById(data.definitionId)
  if (!def) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-xs text-red-400">
        Unknown: {data.definitionId}
      </div>
    )
  }

  const IconComponent = iconMap[def.icon] || Zap
  const gradient = categoryGradients[def.type] || 'from-gray-500/20 to-gray-500/5'
  const nodeColor = def.color || '#6366f1'

  return (
    <div
      className={`rounded-lg border-2 min-w-[160px] bg-[#1E1E2E] bg-gradient-to-br ${gradient} transition-all`}
      style={{
        borderColor: selected ? nodeColor : `${nodeColor}40`,
        boxShadow: selected ? `0 0 0 1px ${nodeColor}, 0 0 20px ${nodeColor}20` : 'none'
      }}
    >
      {def.hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{
            width: 14, height: 14, background: nodeColor,
            border: '3px solid #121212', borderRadius: '50%',
            left: -9, top: '50%', cursor: 'crosshair'
          }}
        />
      )}

      <div className="flex items-center gap-2 px-2.5 py-2">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${nodeColor}20`, color: nodeColor }}
        >
          {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-gray-100 truncate">{def.label}</div>
          <div className="text-[9px] text-gray-500 capitalize">{def.type}</div>
        </div>
      </div>

      <PropertyPreview defId={def.id} props={data.properties || {}} />

      {(def.hasOutput || def.branches) && (
        <>
          {def.branches ? (
            <div className="flex border-t border-white/5">
              <div className="flex-1 relative py-1 text-[9px] text-center text-green-400 bg-green-500/5">
                ✓ True
                <Handle type="source" position={Position.Right} id="branch-true"
                  style={{
                    width: 16, height: 16, background: '#22c55e',
                    border: '3px solid #121212', borderRadius: '50%',
                    right: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
                    cursor: 'crosshair'
                  }}
                />
              </div>
              <div className="w-px bg-white/5" />
              <div className="flex-1 relative py-1 text-[9px] text-center text-red-400 bg-red-500/5">
                ✗ False
                <Handle type="source" position={Position.Right} id="branch-false"
                  style={{
                    width: 16, height: 16, background: '#ef4444',
                    border: '3px solid #121212', borderRadius: '50%',
                    right: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 10,
                    cursor: 'crosshair'
                  }}
                />
              </div>
            </div>
          ) : (
            <Handle
              type="source"
              position={Position.Right}
              id="output"
              style={{
                width: 16, height: 16, background: nodeColor,
                border: '3px solid #121212', borderRadius: '50%',
                right: -10, top: '50%', cursor: 'crosshair'
              }}
            />
          )}
        </>
      )}
    </div>
  )
})

BlockNode.displayName = 'BlockNode'
export default BlockNode
