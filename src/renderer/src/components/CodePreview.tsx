import React from 'react'
import { useEditorStore } from '../store/editorStore'
import { useProjectStore } from '../store/projectStore'
import { generateBot } from '../generators/botGenerator'
import { X } from 'lucide-react'

export function CodePreview() {
  const { showCodePreview, toggleCodePreview } = useProjectStore()
  const { nodes, edges, botPrefix, botToken } = useEditorStore()

  if (!showCodePreview) return null

  let code = ''
  try {
    code = generateBot(nodes, edges, botPrefix, botToken)
  } catch (e) {
    code = '// Error generating code:\n// ' + (e instanceof Error ? e.message : String(e))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[800px] max-h-[80vh] bg-[#1A1A2E] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <span className="text-sm font-semibold text-gray-100">Generated Bot Code</span>
          <button onClick={toggleCodePreview} className="text-gray-500 hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-50px)]">
          <pre className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{code}</pre>
        </div>
      </div>
    </div>
  )
}
