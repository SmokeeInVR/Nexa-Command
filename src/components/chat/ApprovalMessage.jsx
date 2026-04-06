function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    timeZone: 'America/Phoenix',
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

export default function ApprovalMessage({ message, onApprove, onReject }) {
  const { content, timestamp, woid, approved, rejected } = message

  return (
    <div className="flex gap-3">
      {/* Ella orb */}
      <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold font-mono bg-nexa-green text-nexa-black">
        EL
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold font-mono uppercase tracking-wider text-nexa-green">ELLA</span>
          <span className="text-[10px] text-nexa-muted font-mono">{formatTime(timestamp)}</span>
          {!approved && !rejected && (
            <span className="badge bg-nexa-amber/20 text-nexa-amber border border-nexa-amber/30 animate-pulse">
              ⚠ Awaiting Approval
            </span>
          )}
          {approved && (
            <span className="badge bg-nexa-green/20 text-nexa-green border border-nexa-green/30">✓ Approved</span>
          )}
          {rejected && (
            <span className="badge bg-nexa-red/20 text-nexa-red border border-nexa-red/30">✕ Hold</span>
          )}
        </div>

        {/* Draft content */}
        <div className={`
          rounded border font-mono text-[13px] leading-relaxed whitespace-pre-wrap
          ${approved
            ? 'border-nexa-green/30 bg-nexa-green/5 text-nexa-text/70'
            : rejected
            ? 'border-nexa-border bg-nexa-surface/30 text-nexa-muted line-through'
            : 'border-nexa-amber/40 bg-nexa-amber/5 text-nexa-text'}
        `}>
          {/* Header bar */}
          <div className={`
            px-3 py-1.5 border-b rounded-t text-[10px] uppercase tracking-widest font-bold
            flex items-center justify-between
            ${approved
              ? 'border-nexa-green/20 text-nexa-green bg-nexa-green/10'
              : rejected
              ? 'border-nexa-border text-nexa-muted'
              : 'border-nexa-amber/20 text-nexa-amber bg-nexa-amber/10'}
          `}>
            <span>Outreach Draft · WOID {woid}</span>
            <span className="text-nexa-muted font-normal normal-case">Marcel approval required</span>
          </div>
          <div className="px-3 py-2.5">{content}</div>
        </div>

        {/* APPROVE / HOLD buttons */}
        {!approved && !rejected && (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(message.id)}
              className="px-5 py-1.5 rounded text-xs font-bold font-mono uppercase tracking-wider
                         bg-nexa-gold hover:bg-nexa-gold/80 text-nexa-black
                         transition-colors"
            >
              ✓ Approve
            </button>
            <button
              onClick={() => onReject(message.id)}
              className="px-5 py-1.5 rounded text-xs font-bold font-mono uppercase tracking-wider
                         bg-nexa-red/20 hover:bg-nexa-red/30 text-nexa-red border border-nexa-red/40
                         transition-colors"
            >
              ✕ Hold
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
