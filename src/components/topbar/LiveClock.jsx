import { useLiveClock } from '../../hooks/useLiveClock'

export default function LiveClock() {
  const { timeStr, dateStr } = useLiveClock()

  return (
    <div className="flex flex-col items-end flex-shrink-0">
      <span className="text-lg font-mono font-bold text-nexa-gold tabular-nums leading-none">
        {timeStr}
      </span>
      <span className="text-[10px] text-nexa-muted tracking-wider uppercase mt-0.5 font-mono">
        {dateStr} · AZ
      </span>
    </div>
  )
}
