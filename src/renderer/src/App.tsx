import React, { useEffect } from 'react'
import { useEditorStore } from './store/editorStore'
import { WelcomeScreen } from './components/WelcomeScreen'
import { EditorLayout } from './components/EditorLayout'

export default function App() {
  const { isWelcomeScreen, loadProject, clearProject, setWelcomeScreen, nodes, edges } = useEditorStore()

  useEffect(() => {
    if (!window.electronAPI) return
    const store = useEditorStore.getState()

    const unsubNew = window.electronAPI.onMenuNewProject(() => {
      store.clearProject()
      store.setWelcomeScreen(true)
    })
    const unsubSave = window.electronAPI.onMenuSave(async () => {
      const { nodes, edges } = store.getCurrentState()
      const data = JSON.stringify({ nodes, edges })
      await window.electronAPI?.saveProject?.(data)
    })
    const unsubUndo = window.electronAPI.onMenuUndo(() => store.undo())
    const unsubRedo = window.electronAPI.onMenuRedo(() => store.redo())
    const unsubOpen = window.electronAPI.onFileOpen((content: string) => {
      try {
        const data = JSON.parse(content)
        if (data.nodes && data.edges) store.loadProject(data.nodes, data.edges)
      } catch {}
    })

    return () => {
      window.electronAPI?.removeAllListeners('menu:new-project')
      window.electronAPI?.removeAllListeners('menu:save')
      window.electronAPI?.removeAllListeners('menu:undo')
      window.electronAPI?.removeAllListeners('menu:redo')
      window.electronAPI?.removeAllListeners('file:open')
    }
  }, [])

  useEffect(() => {
    if (!isWelcomeScreen) {
      const autoSave = setInterval(() => {
        try {
          localStorage.setItem('discord-bot-autosave', JSON.stringify({ nodes, edges }))
        } catch {}
      }, 10000)
      return () => clearInterval(autoSave)
    }
  }, [isWelcomeScreen, nodes, edges])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('discord-bot-autosave')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.nodes?.length > 0) loadProject(data.nodes, data.edges || [])
      }
    } catch {}
  }, [])

  if (isWelcomeScreen) return <WelcomeScreen />
  return <EditorLayout />
}
