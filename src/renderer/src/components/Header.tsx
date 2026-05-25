import React, { useState } from 'react'
import { useEditorStore } from '../store/editorStore'
import { useProjectStore } from '../store/projectStore'
import { generateBot } from '../generators/botGenerator'
import { Button } from './ui/Button'
import {
  Undo2, Redo2, Save, Code2, Play, Pencil,
  Settings, Lock, Unlock
} from 'lucide-react'

export function Header() {
  const {
    projectName, setProjectName,
    botToken, setBotToken,
    botPrefix, setBotPrefix,
    undo, redo,
    nodes, edges,
    clearProject, setWelcomeScreen
  } = useEditorStore()
  const { saveProject, toggleCodePreview } = useProjectStore()
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(projectName)
  const [showToken, setShowToken] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  const handleSave = async () => {
    await saveProject(nodes, edges)
  }

  const handleExport = () => {
    try {
      const code = generateBot(nodes, edges, botPrefix, botToken)
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bot.js'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export failed:', e)
      alert('Export failed: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  const handleNew = () => {
    clearProject()
    setWelcomeScreen(true)
  }

  return (
    <header className="h-11 bg-[#1A1A2E]/85 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-3 shrink-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <span className="text-indigo-400 text-xs font-bold">DB</span>
        </div>
        {editingName ? (
          <input
            autoFocus
            className="bg-white/10 text-sm text-gray-100 px-2 py-0.5 rounded border border-white/20 outline-none w-40"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onBlur={() => { setProjectName(nameInput); setEditingName(false) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { setProjectName(nameInput); setEditingName(false) }
            }}
          />
        ) : (
          <button onClick={() => setEditingName(true)} className="flex items-center gap-1 text-sm text-gray-100 hover:text-indigo-400 transition-colors group">
            <span>{projectName}</span>
            <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1">
        <div className="relative">
          <Button
            variant="ghost" size="sm"
            icon={showConfig ? <Unlock className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
            onClick={() => setShowConfig(!showConfig)}
            title="Bot configuration"
          />
          {showConfig && (
            <div className="absolute top-full mt-1 right-0 w-72 p-3 rounded-xl bg-[#1A1A2E] border border-white/10 shadow-xl z-50 space-y-2">
              <div className="text-xs font-semibold text-gray-400 mb-2">Bot Configuration</div>
              <div>
                <label className="text-[10px] text-gray-500">Discord Token</label>
                <div className="flex gap-1">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="MTE5..."
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-100 placeholder-gray-700 outline-none"
                  />
                  <button onClick={() => setShowToken(!showToken)} className="text-gray-500 hover:text-gray-300 px-1">
                    {showToken ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Command Prefix</label>
                <input
                  type="text"
                  value={botPrefix}
                  onChange={(e) => setBotPrefix(e.target.value)}
                  placeholder="!"
                  maxLength={5}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-100 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <Button variant="ghost" size="sm" icon={<Undo2 className="w-3.5 h-3.5" />} onClick={undo} title="Undo" />
        <Button variant="ghost" size="sm" icon={<Redo2 className="w-3.5 h-3.5" />} onClick={redo} title="Redo" />

        <div className="w-px h-5 bg-white/10 mx-1" />

        <Button variant="ghost" size="sm" icon={<Save className="w-3.5 h-3.5" />} onClick={handleSave} title="Save project" />
        <Button variant="ghost" size="sm" icon={<Code2 className="w-3.5 h-3.5" />} onClick={toggleCodePreview} title="Preview code" />

        <div className="w-px h-5 bg-white/10 mx-1" />

        <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />} onClick={handleExport} title="Export bot code">
          Export
        </Button>

        <Button variant="ghost" size="sm" onClick={handleNew} title="New project" className="ml-1">
          New
        </Button>
      </div>
    </header>
  )
}
