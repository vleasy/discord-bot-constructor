import React, { memo, useState } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { FolderOpen, FolderClosed, GripVertical } from 'lucide-react'

const GroupNode = memo(({ data, selected }: NodeProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const label = data.label || 'Group'

  return (
    <div
      className={`rounded-lg border-2 min-w-[200px] min-h-[80px] bg-[#1A1A2E]/40 backdrop-blur-sm transition-all`}
      style={{
        borderColor: selected ? '#6366f1' : '#6366f140',
        borderStyle: 'dashed',
        boxShadow: selected ? '0 0 0 1px #6366f1, 0 0 20px #6366f120' : 'none'
      }}
    >
      <div className="flex items-center gap-1.5 px-2 py-1 border-b border-white/5 bg-white/[0.02]">
        <GripVertical className="w-3 h-3 text-gray-500" />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-200 transition-colors"
        >
          {collapsed ? <FolderClosed className="w-3 h-3" /> : <FolderOpen className="w-3 h-3" />}
        </button>
        <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wider">{label}</span>
      </div>
      {collapsed && (
        <div className="px-3 py-4 text-center text-[10px] text-gray-500 italic">
          {data.childCount || 0} blocks hidden
        </div>
      )}

      <Handle
        type="target"
        position={Position.Left}
        id="group-input"
        style={{ width: 10, height: 10, background: '#6366f1', border: '2px solid #121212', borderRadius: '50%', left: -6 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="group-output"
        style={{ width: 10, height: 10, background: '#6366f1', border: '2px solid #121212', borderRadius: '50%', right: -6 }}
      />
    </div>
  )
})

GroupNode.displayName = 'GroupNode'
export default GroupNode
