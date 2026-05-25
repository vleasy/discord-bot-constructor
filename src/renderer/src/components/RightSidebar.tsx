import React from 'react'
import { useEditorStore } from '../store/editorStore'
import { getBlockById } from '../data'
import { Input, Select, Toggle } from './ui/Input'
import { X, Settings, Trash2, Info } from 'lucide-react'
import { Button } from './ui/Button'
import { EmbedPreview } from './EmbedPreview'
import type { FieldDef } from '../types'

function FieldRenderer({ field, value, onChange }: { field: FieldDef; value: any; onChange: (key: string, val: any) => void }) {
  switch (field.type) {
    case 'string':
      return (
        <Input
          label={field.label}
          placeholder={field.placeholder}
          value={value ?? field.defaultValue ?? ''}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )
    case 'number':
      return (
        <Input
          label={field.label}
          type="number"
          placeholder={field.placeholder}
          value={value ?? field.defaultValue ?? 0}
          onChange={(e) => onChange(field.key, Number(e.target.value))}
        />
      )
    case 'boolean':
      return (
        <Toggle
          label={field.label}
          checked={value ?? field.defaultValue ?? false}
          onChange={(checked) => onChange(field.key, checked)}
        />
      )
    case 'select':
      return (
        <Select
          label={field.label}
          options={field.options || []}
          value={value ?? field.defaultValue ?? ''}
          onChange={(val) => onChange(field.key, val)}
        />
      )
    default:
      return (
        <Input
          label={field.label}
          placeholder={field.placeholder}
          value={String(value ?? field.defaultValue ?? '')}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      )
  }
}

function EmbedPreviewRenderer({ props }: { props: Record<string, any> }) {
  return (
    <div className="space-y-2 pt-2 border-t border-white/5">
      <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Preview</div>
      <EmbedPreview
        title={props.title}
        description={props.description}
        color={props.color}
        footer={props.footer}
        image_url={props.image_url}
        thumbnail_url={props.thumbnail_url}
      />
    </div>
  )
}

export function RightSidebar() {
  const { selectedNodeId, nodes, updateNodeData, removeSelected, selectNode } = useEditorStore()
  const selectedNode = nodes.find(n => n.id === selectedNodeId)
  const def = selectedNode ? getBlockById(selectedNode.data.definitionId) : null

  if (!selectedNode || !def) {
    return (
      <aside className="w-64 bg-[#1A1A2E]/60 backdrop-blur-md border-l border-white/5 flex flex-col shrink-0">
        <div className="p-4 text-center text-gray-500 text-xs mt-8">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Select a block to edit</p>
        </div>
      </aside>
    )
  }

  const props = selectedNode.data.properties || {}

  return (
    <aside className="w-64 bg-[#1A1A2E]/60 backdrop-blur-md border-l border-white/5 flex flex-col shrink-0">
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: def.color }} />
          <span className="text-sm font-medium text-gray-100">{def.label}</span>
        </div>
        <button onClick={() => selectNode(null)} className="text-gray-500 hover:text-gray-200 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {def.fields.length === 0 ? (
          <div className="flex items-start gap-2 text-xs text-gray-500 p-2">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>No configurable properties.</p>
          </div>
        ) : (
          <>
            {def.fields.map((field) => (
              <FieldRenderer key={field.key} field={field} value={props[field.key]} onChange={(k, v) => updateNodeData(selectedNode.id, { [k]: v })} />
            ))}
            {def.id === 'create_embed' && (
              <EmbedPreviewRenderer props={props} />
            )}
            {def.id === 'send_components' && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Component Preview</div>
                <div className="bg-[#2B2D31] rounded-md p-2 space-y-1">
                  {(() => {
                    try {
                      const comps = JSON.parse(props.components || '[]')
                      return comps.length === 0 ? (
                        <div className="text-[10px] text-gray-500 italic">No components defined</div>
                      ) : (
                        comps.map((comp: any, i: number) => (
                          <div key={i} className="bg-[#1E1E2E] rounded px-2 py-1 text-[10px] text-gray-300 flex items-center gap-2">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                              comp.type === 'button' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {comp.type === 'button' ? 'Btn' : 'Select'}
                            </span>
                            <span>{comp.label || comp.custom_id || '?'}</span>
                          </div>
                        ))
                      )
                    } catch {
                      return <div className="text-[10px] text-red-400">Invalid JSON</div>
                    }
                  })()}
                </div>
              </div>
            )}
            {def.id === 'respond_modal' && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Modal Preview</div>
                <div className="bg-[#2B2D31] rounded-md p-2 space-y-1">
                  {(() => {
                    try {
                      const inputs = JSON.parse(props.inputs || '[]')
                      return inputs.length === 0 ? (
                        <div className="text-[10px] text-gray-500 italic">No inputs defined</div>
                      ) : (
                        inputs.map((inp: any, i: number) => (
                          <div key={i} className="bg-[#1E1E2E] rounded px-2 py-1 text-[10px] text-gray-300">
                            <span className="text-gray-500">#{i + 1}</span> {inp.label || inp.custom_id || 'Input'}
                          </div>
                        ))
                      )
                    } catch {
                      return <div className="text-[10px] text-red-400">Invalid JSON</div>
                    }
                  })()}
                </div>
              </div>
            )}
          </>
        )}
        </div>

        <div className="pt-2 border-t border-white/5">
          <div className="text-[10px] text-gray-600 font-medium uppercase tracking-wider mb-2">Block Info</div>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>Type</span>
              <span className="capitalize">{def.type}</span>
            </div>
            <div className="flex justify-between">
              <span>ID</span>
              <span className="text-gray-500">{def.id}</span>
            </div>
          </div>
        </div>

      <div className="p-2 border-t border-white/5">
        <Button variant="danger" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={removeSelected} className="w-full">
          Delete Block
        </Button>
      </div>
    </aside>
  )
}
