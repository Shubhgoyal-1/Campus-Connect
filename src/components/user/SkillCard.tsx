import React from 'react'
import { cn } from '@/lib/utils'
import { skillIconMap } from '@/lib/skillIcons'

interface SkillCardProps {
  skill: string
  selected: boolean
  onClick: () => void
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, selected, onClick }) => {
  const Icon = skillIconMap[skill] || undefined

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer p-3 rounded-lg border text-center text-white transition-all text-sm flex items-center gap-2',
        selected ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/20 hover:bg-white/10'
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{skill}</span>
    </div>
  )
}

export default SkillCard
