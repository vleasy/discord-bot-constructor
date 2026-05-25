import React from 'react'
import { useEditorStore } from '../store/editorStore'
import { templates } from '../data/templates'
import { Button } from './ui/Button'
import { Sparkles, BookOpen, ArrowRight, MessageCircle, LogIn, Shield } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  'message-circle': <MessageCircle className="w-5 h-5" />,
  'log-in': <LogIn className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />
}

const difficultyColors: Record<string, string> = {
  easy: 'text-green-400 bg-green-500/10 border-green-500/20',
  medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20'
}

const difficultyLabels: Record<string, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard'
}

export function WelcomeScreen() {
  const { loadTemplate, clearProject, setWelcomeScreen } = useEditorStore()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#121212] p-8">
      <div className="max-w-3xl w-full space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-[#1A1A2E]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/5">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-semibold text-gray-100">Discord Bot Constructor</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mt-4">
            Build Discord bots visually, <span className="text-indigo-400">no coding needed</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            Drag and drop blocks to create Discord bots. Connect events with actions,
            add conditions and logic — generate ready-to-use Discord.js code.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            <span>Choose a template to start:</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => loadTemplate(tpl.nodes, tpl.edges)}
                className="bg-[#1A1A2E]/80 backdrop-blur-md rounded-xl p-5 text-left hover:bg-white/[0.08] transition-all duration-200 group border border-white/5 hover:border-white/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tpl.difficulty === 'easy' ? 'bg-amber-500/20 text-amber-400' :
                    tpl.difficulty === 'medium' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {iconMap[tpl.icon] || <MessageCircle className="w-5 h-5" />}
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${difficultyColors[tpl.difficulty]}`}>
                    {difficultyLabels[tpl.difficulty]}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-gray-100 mb-1">{tpl.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{tpl.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">{tpl.nodes.length} blocks</span>
                  <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            size="lg"
            icon={<Sparkles className="w-4 h-4" />}
            onClick={() => { clearProject(); setWelcomeScreen(false) }}
            className="text-gray-400 hover:text-gray-200"
          >
            Start from scratch
          </Button>
        </div>
      </div>
    </div>
  )
}
