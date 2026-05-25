import React, { useState, useMemo } from 'react'
import { allBlocks } from '../data'
import type { BlockDefinition, BlockCategory } from '../types'
import {
  Search, Zap, Play, GitBranch, Variable, ChevronDown, ChevronRight, GripVertical
} from 'lucide-react'

const categoryMeta: Record<BlockCategory, { icon: React.ReactNode; label: string; color: string }> = {
  trigger: { icon: <Zap className="w-3.5 h-3.5" />, label: 'Events', color: '#FBBF24' },
  action: { icon: <Play className="w-3.5 h-3.5" />, label: 'Actions', color: '#22D3EE' },
  condition: { icon: <GitBranch className="w-3.5 h-3.5" />, label: 'Conditions', color: '#F87171' },
  logic: { icon: <Variable className="w-3.5 h-3.5" />, label: 'Logic', color: '#A78BFA' }
}

const categoryOrder: BlockCategory[] = ['trigger', 'action', 'condition', 'logic']

export function LeftSidebar() {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const filtered = useMemo(() => {
    if (!search.trim()) return allBlocks
    const q = search.toLowerCase()
    return allBlocks.filter(b =>
      b.label.toLowerCase().includes(q) ||
      b.tags.some(t => t.includes(q)) ||
      b.description.toLowerCase().includes(q)
    )
  }, [search])

  const grouped = useMemo(() => {
    const map = new Map<BlockCategory, BlockDefinition[]>()
    for (const cat of categoryOrder) map.set(cat, [])
    for (const block of filtered) {
      const arr = map.get(block.type)
      if (arr) arr.push(block)
    }
    return map
  }, [filtered])

  const onDragStart = (event: React.DragEvent, definitionId: string) => {
    event.dataTransfer.setData('application/reactflow', definitionId)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="w-56 bg-[#1A1A2E]/60 backdrop-blur-md border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
      <div className="p-2.5 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-100 placeholder-gray-600 outline-none focus:border-indigo-500/40 transition-all"
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
        {categoryOrder.map((cat) => {
          const blocks = grouped.get(cat) || []
          const meta = categoryMeta[cat]
          const isCollapsed = collapsed[cat]
          if (blocks.length === 0 && !search) return null

          return (
            <div key={cat}>
              <button
                className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors"
                onClick={() => setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }))}
              >
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {meta.icon}
                <span>{meta.label}</span>
                <span className="ml-auto text-[10px] text-gray-600">{blocks.length}</span>
              </button>

              {!isCollapsed && blocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, block.id)}
                  className="flex items-center gap-2 px-3 py-1.5 mx-1.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-white/[0.06] transition-colors group/item relative"
                >
                  <GripVertical className="w-3 h-3 text-gray-600 group-hover/item:text-gray-400 transition-colors shrink-0" />
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: block.color }} />
                  <span className="text-xs text-gray-200 truncate flex-1 min-w-0">{block.label}</span>
                  <div className="absolute left-0 right-0 top-full mt-0.5 mx-1 p-2 rounded-lg bg-[#1E1E2E]/95 border border-white/10 shadow-xl opacity-0 pointer-events-none group-hover/item:opacity-100 transition-opacity z-50">
                    <div className="text-[10px] font-semibold text-gray-100 mb-0.5">{block.label}</div>
                    <div className="text-[9px] text-gray-400 leading-relaxed">{block.description}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className="text-[8px] px-1 py-0.5 rounded bg-white/5 text-gray-500 capitalize">{block.type}</span>
                      {block.tags?.slice(0, 3).map(t => (
                        <span key={t} className="text-[8px] px-1 py-0.5 rounded bg-white/5 text-gray-600">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
