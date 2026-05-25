import React from 'react'

interface Props {
  children?: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  title?: string
  disabled?: boolean
}

export function Button({ children, variant = 'ghost', size = 'sm', icon, onClick, className = '', title, disabled }: Props) {
  const base = 'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all active:scale-95'
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
  }
  const sizes = {
    sm: 'px-2 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-sm'
  }
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}
