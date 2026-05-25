import React from 'react'
import { Header } from './Header'
import { LeftSidebar } from './LeftSidebar'
import { RightSidebar } from './RightSidebar'
import { FlowCanvas } from './FlowCanvas'
import { CodePreview } from './CodePreview'
import { BotPanel } from './BotPanel'

export function EditorLayout() {
  return (
    <div className="h-screen flex flex-col bg-[#121212] overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <FlowCanvas />
        <RightSidebar />
      </div>
      <BotPanel />
      <CodePreview />
    </div>
  )
}
