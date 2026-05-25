import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useEditorStore } from '../store/editorStore'
import { useProjectStore } from '../store/projectStore'
import { Button } from './ui/Button'
import { Play, Square, Terminal, X, Trash2 } from 'lucide-react'
import type { Node, Edge } from '@xyflow/react'

interface LogEntry {
  text: string
  type: 'info' | 'warn' | 'error' | 'success'
  timestamp: number
}

const logColors: Record<string, string> = {
  info: 'text-gray-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  success: 'text-green-400'
}

export function BotPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [running, setRunning] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const { showBotPanel, toggleBotPanel } = useProjectStore()
  const { botToken, botPrefix } = useEditorStore()

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  useEffect(() => {
    if (!window.electronAPI?.bot) return
    const unsub = window.electronAPI.bot.onLog((data: any) => {
      setLogs(prev => [...prev, { text: data.text, type: data.type, timestamp: data.timestamp }].slice(-200))
    })
    return () => unsub()
  }, [])

  const handleStart = useCallback(async () => {
    if (!window.electronAPI?.bot) return
    setLogs([])
    setRunning(true)
    const project = {
      id: 'current',
      name: useEditorStore.getState().projectName,
      config: { token: botToken, prefix: botPrefix, intents: ['Guilds', 'GuildMessages', 'MessageContent'], status: { type: 'playing', text: '!help' } },
      modules: [],
      status: 'offline' as const,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
    const ok = await window.electronAPI.bot.start(project)
    if (!ok) {
      setLogs(prev => [...prev, { text: '[ERROR] Failed to start bot', type: 'error', timestamp: Date.now() }])
      setRunning(false)
    }
  }, [botToken, botPrefix])

  const handleStop = useCallback(async () => {
    if (!window.electronAPI?.bot) return
    await window.electronAPI.bot.stop('current')
    setRunning(false)
    setLogs(prev => [...prev, { text: '[STOPPED] Bot process terminated', type: 'warn', timestamp: Date.now() }])
  }, [])

  if (!showBotPanel) return null

  return (
    <div className="border-t border-white/5 bg-[#1A1A2E]/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-medium text-gray-300">Bot Console</span>
          <span className={`w-2 h-2 rounded-full ${running ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-[10px] text-gray-500">{running ? 'Running' : 'Stopped'}</span>
        </div>
        <div className="flex items-center gap-1">
          {running ? (
            <Button variant="ghost" size="sm" icon={<Square className="w-3 h-3" />} onClick={handleStop} title="Stop Bot" />
          ) : (
            <Button variant="ghost" size="sm" icon={<Play className="w-3 h-3" />} onClick={handleStart} title="Start Bot" />
          )}
          <Button variant="ghost" size="sm" icon={<Trash2 className="w-3 h-3" />} onClick={() => setLogs([])} title="Clear Logs" />
          <Button variant="ghost" size="sm" icon={<X className="w-3 h-3" />} onClick={toggleBotPanel} title="Close" />
        </div>
      </div>
      <div ref={logRef} className="h-28 overflow-y-auto p-2 font-mono text-[11px] space-y-0.5 bg-black/30">
        {logs.length === 0 && (
          <div className="text-gray-600 italic">Click Start to launch the bot...</div>
        )}
        {logs.map((entry, i) => (
          <div key={i} className={logColors[entry.type] || 'text-gray-400'}>
            <span className="text-gray-600">{new Date(entry.timestamp).toLocaleTimeString()}</span>
            {' '}{entry.text}
          </div>
        ))}
      </div>
    </div>
  )
}


