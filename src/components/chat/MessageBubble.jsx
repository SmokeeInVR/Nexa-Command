function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: 'America/Phoenix',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

const AGENT_LABEL = {
  nexa: 'NEXA', atlas: 'ATLAS', ella: 'ELLA', dex: 'DEX',
  system: 'SYS', user: 'YOU',
}

export default function MessageBubble({ message, meta }) {
  const { agent, content, timestamp, type } = message
  const m = meta[agent] || meta.system
  const isUser = agent === 'user'
  const isSystem = type === 'system'

  if (isSystem) {
    return (
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 border-t border-nexa-border" />
        <span className="text-[10px] text-nexa-muted uppercase tracking-widest whitespace-nowrap font-mono">
          {content}
        </span>
        <div className="flex-1 border-t border-nexa-border" />
      </div>
    )
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Orb */}
      <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold font-mono ${m.orb}`}>
        {(AGENT_LABEL[agent] || agent).slice(0, 2)}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2">
          {!isUser && (
            <span className={`text-[10px] font-bold font-mono uppercase tracking-wider ${m.color}`}>
              {AGENT_LABEL[agent] || agent}
            </span>
          )}
          <span className="text-[10px] text-nexa-muted font-mono">{formatTime(timestamp)}</span>
        </div>

        <div className={`
          rounded px-3 py-2 text-[13px] font-mono whitespace-pre-wrap leading-relaxed
          border ${m.border} ${m.bg}
          ${isUser ? 'border-nexa-gold/20 bg-nexa-gold/5' : ''}
          ${type === 'alert' ? 'border-nexa-amber/40 bg-nexa-amber/5' : ''}
          ${type === 'report' ? 'text-nexa-text/80' : 'text-nexa-text'}
        `}>
          {content}
        </div>
      </div>
    </div>
  )
}
