const NAV_ITEMS = [
  { icon: '⚡', label: 'Command',     active: true  },
  { icon: '📋', label: 'Inspections', active: false },
  { icon: '📅', label: 'Calendar',    active: false },
  { icon: '📊', label: 'Finance',     active: false },
  { icon: '🧠', label: 'Memory',      active: false },
  { icon: '⚙',  label: 'Settings',   active: false },
]

const AGENT_SHORTCUTS = [
  { id: 'nexa',  label: 'NEXA',  dotColor: 'bg-nexa-gold'  },
  { id: 'atlas', label: 'Atlas', dotColor: 'bg-blue-400'   },
  { id: 'ella',  label: 'Ella',  dotColor: 'bg-nexa-green' },
  { id: 'dex',   label: 'Dex',   dotColor: 'bg-nexa-amber' },
]

export default function NavLinks({ onAgentSelect }) {
  return (
    <nav className="flex flex-col gap-0.5">
      <p className="section-label px-3 mb-2 mt-1">Navigation</p>

      {NAV_ITEMS.map(item => (
        <button
          key={item.label}
          className={`
            flex items-center gap-3 px-3 py-2 text-left transition-colors
            text-sm w-full rounded-sm
            ${item.active
              ? 'border-l-2 border-nexa-gold text-nexa-gold bg-nexa-gold/5 pl-[10px]'
              : 'border-l-2 border-transparent text-nexa-muted hover:text-nexa-text hover:bg-nexa-border/40 pl-[10px]'}
          `}
        >
          <span className="text-base leading-none">{item.icon}</span>
          <span className="font-sans font-medium text-[13px]">{item.label}</span>
        </button>
      ))}

      <p className="section-label px-3 mb-2 mt-5">Agents</p>

      {AGENT_SHORTCUTS.map(agent => (
        <button
          key={agent.id}
          onClick={() => onAgentSelect?.(agent.id)}
          className="
            flex items-center gap-3 px-3 py-2 border-l-2 border-transparent pl-[10px]
            text-nexa-muted hover:text-nexa-text hover:bg-nexa-border/40
            text-[13px] font-sans font-medium w-full text-left transition-colors rounded-sm
          "
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.dotColor}`} />
          <span>{agent.label}</span>
        </button>
      ))}
    </nav>
  )
}
