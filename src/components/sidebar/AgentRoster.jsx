const STATUS_DOT = {
  online:  'bg-nexa-green shadow-[0_0_5px_rgba(34,197,94,0.7)]',
  working: 'bg-nexa-amber shadow-[0_0_5px_rgba(239,159,39,0.7)] animate-pulse',
  idle:    'bg-nexa-amber/50',
  error:   'bg-nexa-red animate-pulse',
  offline: 'bg-nexa-muted/40',
}

const STATUS_LABEL = {
  online: 'Online', working: 'Working', idle: 'Idle', error: 'Error', offline: 'Offline',
}

const AGENT_STYLE = {
  nexa:  { ring: 'border-nexa-gold/40',  orb: 'bg-nexa-gold text-nexa-black',    name: 'text-nexa-gold'  },
  atlas: { ring: 'border-blue-500/40',   orb: 'bg-blue-500 text-white',           name: 'text-blue-400'   },
  ella:  { ring: 'border-nexa-green/40', orb: 'bg-nexa-green text-nexa-black',    name: 'text-nexa-green' },
  dex:   { ring: 'border-nexa-amber/40', orb: 'bg-nexa-amber text-nexa-black',    name: 'text-nexa-amber' },
}

export default function AgentRoster({ agents }) {
  return (
    <div className="flex flex-col gap-2">
      {agents.map(agent => {
        const s = AGENT_STYLE[agent.id] || AGENT_STYLE.nexa
        return (
          <div
            key={agent.id}
            className={`bg-nexa-black border ${s.ring} rounded px-3 py-2.5 flex items-start gap-3`}
          >
            {/* Orb */}
            <div className={`w-8 h-8 rounded flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0 ${s.orb}`}>
              {agent.name.slice(0, 2).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5">
                <span className={`text-xs font-bold font-mono ${s.name}`}>{agent.name}</span>
                <div className="flex items-center gap-1">
                  <div className={`agent-dot ${STATUS_DOT[agent.status]}`} />
                  <span className="text-[10px] text-nexa-muted font-mono">{STATUS_LABEL[agent.status]}</span>
                </div>
              </div>
              <p className="text-[10px] text-nexa-muted mt-0.5 font-sans">{agent.role}</p>
              <p className="text-[10px] text-nexa-text/60 mt-0.5 truncate font-sans" title={agent.activity}>
                {agent.activity}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
