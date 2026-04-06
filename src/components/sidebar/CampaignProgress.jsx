function ProgressBar({ value, max, colorClass = 'bg-nexa-gold' }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="relative h-1.5 rounded-full bg-nexa-border overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function CampaignProgress({ quests }) {
  const { mainQuest, bossFights, weeklyQuests } = quests

  return (
    <div className="flex flex-col gap-3">
      {/* Main Quest */}
      <div className="bg-nexa-black border border-nexa-gold/20 rounded px-3 py-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-nexa-gold font-mono">
            Main Quest
          </span>
          <span className="text-[10px] font-mono text-nexa-gold">{mainQuest.progress}%</span>
        </div>
        <p className="text-xs font-mono text-nexa-text mb-1.5">{mainQuest.title}</p>
        <ProgressBar value={mainQuest.progress} max={100} colorClass="bg-nexa-gold" />
        <p className="text-[10px] text-nexa-muted mt-1 font-sans">Target: {mainQuest.deadline}</p>
      </div>

      {/* Boss Fights */}
      {bossFights.map((boss, i) => (
        <div key={i} className="bg-nexa-black border border-nexa-amber/20 rounded px-3 py-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-nexa-amber font-mono">
              ⚔ Boss Fight
            </span>
            <span className="text-[10px] font-mono text-nexa-amber">{boss.progress}%</span>
          </div>
          <p className="text-xs font-mono text-nexa-text mb-1.5">{boss.name}</p>
          <ProgressBar value={boss.progress} max={100} colorClass="bg-nexa-amber" />
          <p className="text-[10px] text-nexa-muted mt-1 truncate font-sans" title={boss.nextMilestone}>
            Next: {boss.nextMilestone}
          </p>
        </div>
      ))}

      {/* Weekly bars */}
      <div className="bg-nexa-black border border-nexa-border rounded px-3 py-2.5">
        <p className="section-label mb-2.5">Weekly Progress</p>
        <div className="flex flex-col gap-2.5">
          {weeklyQuests.map((wq, i) => {
            const numTarget = typeof wq.target === 'number' ? wq.target : null
            const numCurrent = typeof wq.current === 'number' ? wq.current : null
            const pct = numTarget ? Math.round((numCurrent / numTarget) * 100) : 0
            return (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-nexa-text/70 truncate pr-2 font-sans" title={wq.title}>
                    {wq.title}
                  </span>
                  <span className="text-[10px] font-mono text-nexa-text/80 whitespace-nowrap">
                    {numTarget ? `${numCurrent}/${numTarget}` : `${wq.current}`}
                  </span>
                </div>
                {numTarget && (
                  <ProgressBar
                    value={numCurrent}
                    max={numTarget}
                    colorClass={pct >= 100 ? 'bg-nexa-green' : 'bg-nexa-gold'}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
