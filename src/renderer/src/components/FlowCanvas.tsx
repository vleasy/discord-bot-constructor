import React, { useCallback, useRef, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type OnDrop,
  type OnDragOver,
  SelectionMode,
  ReactFlowInstance
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useEditorStore } from '../store/editorStore'
import BlockNode from '../nodes/BlockNode'
import GroupNode from '../nodes/GroupNode'
import DiscordEdge from '../edges/DiscordEdge'

const nodeTypes = { blockNode: BlockNode, groupNode: GroupNode }
const edgeTypes = { discordEdge: DiscordEdge }

export function FlowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, pushHistory, selectNode, selectEdge
  } = useEditorStore()

  const onDragOver: OnDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop: OnDrop = useCallback(
    (event) => {
      event.preventDefault()
      const definitionId = event.dataTransfer.getData('application/reactflow')
      if (!definitionId || !reactFlowInstance.current || !reactFlowWrapper.current) return
      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top
      })
      addNode(definitionId, position)
    },
    [addNode]
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    selectNode(node.id)
  }, [selectNode])

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    selectEdge(edge.id)
  }, [selectEdge])

  const onPaneClick = useCallback(() => {
    selectNode(null)
    selectEdge(null)
  }, [selectNode, selectEdge])

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return
        const store = useEditorStore.getState()
        if (store.selectedNodeId) store.removeSelected()
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); useEditorStore.getState().undo() }
        if (e.key === 'z' && e.shiftKey) { e.preventDefault(); useEditorStore.getState().redo() }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(connection) => { onConnect(connection); pushHistory() }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onInit={onInit}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          selectionMode={SelectionMode.Partial}
          panOnDrag={[2]}
          selectNodesOnDrag={false}
          colorMode="dark"
          defaultEdgeOptions={{ type: 'discordEdge' }}
          style={{ background: '#121212' }}
        >
          <Background variant="dots" gap={24} size={1.5} color="#2A2A2A" />
          <Controls showInteractive={false} position="bottom-left" />
          <MiniMap
            nodeStrokeColor="#3A3A3A"
            nodeColor="#1A1A2E"
            nodeBorderRadius={4}
            maskColor="rgba(0,0,0,0.6)"
            position="bottom-right"
            style={{ width: 160, height: 100 }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  )
}
