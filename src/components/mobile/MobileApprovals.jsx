// Mobile view — shown on screens < 768px (phones in the field)
// Displays all Review-status inspections with large APPROVE / HOLD tap targets

export default function MobileApprovals({ allInspections, approveInspection, holdInspection }) {
  const pending = allInspections.filter(i => i.status === 'Review')

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-nexa-border bg-nexa-surface flex-shrink-0">
        <p className="text-xs font-mono font-bold text-nexa-gold uppercase tracking-widest">
          Pending Approvals
        </p>
        <p className="text-[11px] text-nexa-muted font-sans mt-0.5">
          {pending.length} file{pending.length !== 1 ? 's' : ''} awaiting Marcel
        </p>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {pending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-3xl">✓</div>
            <p className="text-nexa-green font-mono text-sm">All clear — no pending approvals</p>
          </div>
        )}

        {pending.map(insp => (
          <div
            key={insp.woid}
            className="bg-nexa-surface border border-nexa-border rounded-lg p-4 flex flex-col gap-3"
          >
            {/* WOID + priority */}
            <div className="flex items-center justify-between">
              <span className="text-base font-mono font-bold text-nexa-gold">#{insp.woid}</span>
              <span className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                insp.priority === 'Critical' ? 'bg-nexa-red/20 text-nexa-red' :
                insp.priority === 'High'     ? 'border border-nexa-gold text-nexa-gold' :
                'text-nexa-muted'
              }`}>
                {insp.priority}
              </span>
            </div>

            {/* Details */}
            <div>
              <p className="text-[15px] font-sans font-medium text-nexa-text">{insp.insured}</p>
              <p className="text-[12px] font-sans text-nexa-muted mt-0.5">{insp.address}, {insp.city}</p>
              <p className="text-[11px] font-mono text-nexa-muted/70 mt-1">{insp.type} · {insp.carrier}</p>
              {insp.notes && (
                <p className="text-[11px] text-nexa-amber font-sans mt-1">⚠ {insp.notes}</p>
              )}
            </div>

            {/* Large tap buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => approveInspection(insp.woid)}
                className="flex-1 py-3.5 rounded-lg bg-nexa-gold text-nexa-black font-mono font-bold
                           text-sm uppercase tracking-wider active:opacity-80 transition-opacity"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => holdInspection(insp.woid)}
                className="flex-1 py-3.5 rounded-lg bg-nexa-red/20 text-nexa-red font-mono font-bold
                           text-sm uppercase tracking-wider border border-nexa-red/40
                           active:opacity-80 transition-opacity"
              >
                ✕ Hold
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
