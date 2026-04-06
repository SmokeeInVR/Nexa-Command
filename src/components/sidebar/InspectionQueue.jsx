import { daysAssigned } from '../../hooks/useInspections'

const PRIORITY_CARD = {
  Critical: { border: 'border-nexa-red/60',       badge: 'bg-nexa-red text-white',                         label: 'CRITICAL' },
  High:     { border: 'border-nexa-gold/50',       badge: 'bg-transparent border border-nexa-gold text-nexa-gold', label: 'HIGH'  },
  Medium:   { border: 'border-nexa-border',        badge: 'bg-nexa-border text-nexa-muted',                 label: 'MED'      },
  Low:      { border: 'border-nexa-border/50',     badge: 'bg-transparent text-nexa-muted/60',              label: 'LOW'      },
}

const STATUS_DOT = {
  InProgress: { dot: 'bg-nexa-green',   label: 'text-nexa-green' },
  Review:     { dot: 'bg-nexa-amber',   label: 'text-nexa-amber' },
  Backlog:    { dot: 'bg-nexa-muted/50',label: 'text-nexa-muted' },
  Done:       { dot: 'bg-nexa-green',   label: 'text-nexa-green' },
}

export default function InspectionQueue({ inspections, counts, filter, setFilter }) {
  const FILTERS = ['all', 'InProgress', 'Review', 'Backlog']

  return (
    <div className="flex flex-col gap-2">
      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border transition-colors
              ${filter === f
                ? 'bg-nexa-gold/10 text-nexa-gold border-nexa-gold/40'
                : 'bg-transparent text-nexa-muted border-nexa-border hover:text-nexa-text'}
            `}
          >
            {f === 'all'        ? `All (${counts.all})`             :
             f === 'InProgress' ? `Active (${counts.InProgress})`   :
             f === 'Review'     ? `Review (${counts.Review})`       :
             `Queue (${counts.Backlog})`}
          </button>
        ))}
      </div>

      {/* Rental alert */}
      {counts.rental > 0 && (
        <div className="text-[10px] font-mono text-nexa-amber bg-nexa-amber/10 border border-nexa-amber/30 rounded px-2 py-1.5">
          🚗 {counts.rental} file{counts.rental > 1 ? 's' : ''} require rental car
        </div>
      )}

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {inspections.map(insp => {
          const pc = PRIORITY_CARD[insp.priority] || PRIORITY_CARD.Medium
          const sc = STATUS_DOT[insp.status] || STATUS_DOT.Backlog
          const days = daysAssigned(insp.assignedDate)
          const daysRed = days !== null && days > 10

          return (
            <div
              key={insp.woid}
              className={`bg-nexa-surface border ${pc.border} rounded px-3 py-2.5 cursor-pointer hover:bg-nexa-black/40 transition-colors`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold font-mono text-nexa-gold tracking-wider">
                  #{insp.woid}
                  {insp.rentalRequired && <span className="ml-1.5 text-nexa-muted">🚗</span>}
                </span>
                <span className={`badge ${pc.badge}`}>{pc.label}</span>
              </div>

              {/* Insured */}
              <p className="text-[13px] font-sans font-medium text-nexa-text leading-none mb-1">
                {insp.insured}
              </p>

              {/* Address */}
              <p className="text-[11px] font-sans text-nexa-muted leading-tight mb-2">
                {insp.address}, {insp.city} {insp.state}
              </p>

              {/* Bottom row */}
              <div className="flex items-center justify-between gap-2">
                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <div className={`agent-dot ${sc.dot}`} />
                  <span className={`text-[10px] font-mono font-bold ${sc.label}`}>
                    {insp.status === 'InProgress' ? 'Active' : insp.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Days assigned */}
                  {days !== null && (
                    <span className={`text-[10px] font-mono ${daysRed ? 'text-nexa-red font-bold' : 'text-nexa-muted'}`}>
                      {days}d
                    </span>
                  )}
                  {/* Due date */}
                  <span className="text-[10px] text-nexa-muted font-mono">
                    Due {insp.dueDate?.slice(5)}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {insp.notes && !insp.notes.startsWith('[HOLD]') && (
                <p className="text-[10px] text-nexa-amber/70 mt-1.5 truncate font-sans" title={insp.notes}>
                  ⚠ {insp.notes}
                </p>
              )}
              {insp.notes?.startsWith('[HOLD]') && (
                <p className="text-[10px] text-nexa-red/70 mt-1.5 font-mono">● HOLD</p>
              )}
            </div>
          )
        })}

        {inspections.length === 0 && (
          <p className="text-[11px] text-nexa-muted font-mono text-center py-4">
            No files in this view.
          </p>
        )}
      </div>
    </div>
  )
}
