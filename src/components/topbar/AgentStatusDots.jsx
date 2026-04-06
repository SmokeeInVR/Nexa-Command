const STATUS_DOT = {
  online:  'bg-nexa-green shadow-[0_0_6px_rgba(34,197,94,0.8)]',
  working: 'bg-nexa-amber shadow-[0_0_6px_rgba(239,159,39,0.8)]',
  idle:    'bg-nexa-amber/60',
  error:   'bg-nexa-red shadow-[0_0_6px_rgba(226,75,74,0.8)]',
  offline: 'bg-nexa-muted/40',
}

const AGENT_COLOR = {
  nexa:  'text-nexa-gold',
  atlas: 'text-blue-400',
  ella:  'text-nexa-green',
  dex:   'text-nexa-amber',
}

export default function AgentStatusDots({ agents }) {
  return (
    <div className="flex items-center gap-5">
      {agents.map(agent => (
        <div
          key={agent.id}
          className="flex items-center gap-1.5"
          title={`${agent.name}: ${agent.activity}`}
        >
          <div className={`agent-dot ${STATUS_DOT[agent.status] || STATUS_DOT.offline} animate-pulse-slow`} />
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wide ${AGENT_COLOR[agent.id]}`}>
            {agent.name}
          </span>
        </div>
      ))}
    </div>
  )
}
