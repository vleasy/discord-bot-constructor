import React from 'react'

interface InputProps {
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  description?: string
}

export function Input({ label, value, onChange, type = 'text', placeholder, description }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-medium text-gray-400">{label}</label>
      {description && <p className="text-[10px] text-gray-500">{description}</p>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-100 placeholder-gray-600 outline-none focus:border-indigo-500/40 transition-all"
      />
    </div>
  )
}

interface SelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
  description?: string
}

export function Select({ label, value, onChange, options, description }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-medium text-gray-400">{label}</label>
      {description && <p className="text-[10px] text-gray-500">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-100 outline-none focus:border-indigo-500/40 transition-all"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1E1E2E]">{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-medium text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-8 h-4 rounded-full transition-colors ${checked ? 'bg-indigo-500' : 'bg-white/10'}`}
      >
        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </button>
    </label>
  )
}
