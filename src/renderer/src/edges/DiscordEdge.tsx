import React from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'

export default function DiscordEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition
  })

  return (
    <>
      <defs>
        <linearGradient id={`glow-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
        </linearGradient>
        <filter id={`shadow-${id}`}>
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.3" />
        </filter>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `url(#glow-${id})`,
          strokeWidth: selected ? 3 : 2,
          filter: `url(#shadow-${id})`,
          transition: 'stroke-width 0.15s',
          cursor: 'pointer'
        }}
      />
    </>
  )
}
