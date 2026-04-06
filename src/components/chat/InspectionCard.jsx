// Inline inspection file card — appears inside chat when atlas/ella reference a WOID

const TYPE_ICONS = {
  'Interior High Value': '🏛',
  'Exterior Only':       '🏠',
  'Cost of Construction':'📐',
  'Interior Standard':   '🏡',
}

export default function InspectionCard({ inspection }) {
  const { woid, insured, address, city, state, type, carrier, dueDate, replacementCost, rentalRequired } = inspection

  return (
    <div className="border border-cyan-500/20 rounded-lg bg-cyan-500/5 font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="px-3 py-1.5 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider">WOID {woid}</span>
          {rentalRequired && <span className="text-[10px]">🚗 Rental Required</span>}
        </div>
        <span className="text-[10px] text-slate-500">Due: {dueDate}</span>
      </div>

      {/* Body */}
      <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
        <div>
          <span className="text-slate-500 text-[10px]">INSURED</span>
          <p className="text-slate-200 font-semibold">{insured}</p>
        </div>
        <div>
          <span className="text-slate-500 text-[10px]">CARRIER</span>
          <p className="text-slate-300">{carrier}</p>
        </div>
        <div className="col-span-2">
          <span className="text-slate-500 text-[10px]">ADDRESS</span>
          <p className="text-slate-200">{address}, {city}, {state}</p>
        </div>
        <div>
          <span className="text-slate-500 text-[10px]">TYPE</span>
          <p className="text-cyan-300">{TYPE_ICONS[type] || '📋'} {type}</p>
        </div>
        {replacementCost && (
          <div>
            <span className="text-slate-500 text-[10px]">REPLACEMENT COST</span>
            <p className="text-emerald-400 font-bold">${replacementCost.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  )
}
