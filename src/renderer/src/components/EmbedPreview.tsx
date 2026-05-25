import React from 'react'

interface EmbedPreviewProps {
  title?: string
  description?: string
  color?: string
  footer?: string
  image_url?: string
  thumbnail_url?: string
}

export function EmbedPreview({ title, description, color = '#6366f1', footer, image_url, thumbnail_url }: EmbedPreviewProps) {
  return (
    <div className="bg-[#2B2D31] rounded-md border-l-4 overflow-hidden" style={{ borderLeftColor: color }}>
      <div className="p-3 space-y-2">
        {thumbnail_url && (
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              {title && <div className="text-sm font-semibold text-gray-100">{title}</div>}
              {description && <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{description}</div>}
            </div>
            <img src={thumbnail_url} alt="" className="w-16 h-16 rounded-md object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
        )}
        {!thumbnail_url && (
          <>
            {title && <div className="text-sm font-semibold text-gray-100">{title}</div>}
            {description && <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">{description}</div>}
          </>
        )}
        {image_url && (
          <img src={image_url} alt="" className="w-full max-h-40 rounded-md object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        )}
      </div>
      {footer && (
        <div className="px-3 pb-2">
          <div className="text-[10px] text-gray-500 border-t border-white/5 pt-1.5">{footer}</div>
        </div>
      )}
    </div>
  )
}
