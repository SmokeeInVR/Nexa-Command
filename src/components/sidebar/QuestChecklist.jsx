const AGENT_DOT = {
  ella:  'bg-nexa-green',
  atlas: 'bg-blue-400',
  nexa:  'bg-nexa-gold',
  dex:   'bg-nexa-amber',
}

export default function QuestChecklist({ dailyQuests, toggleQuest, dailyXP, totalXP }) {
  const pct = totalXP > 0 ? Math.round((dailyXP / totalXP) * 100) : 0

  return (
    <div className="bg-nexa-black border border-nexa-border rounded px-3 py-2.5 flex flex-col gap-2">
      {/* Header + XP */}
      <div className="flex items-center justify-between">
        <span className="section-label">Daily Quests</span>
        <span className="text-[10px] font-mono text-nexa-gold">{dailyXP}/{totalXP} XP</span>
      </div>

      {/* XP bar */}
      <div className="h-1 rounded-full bg-nexa-border overflow-hidden">
        <div
          className="h-full rounded-full bg-nexa-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Quest list */}
      <div className="flex flex-col gap-1.5 mt-1">
        {dailyQuests.map((quest) => {
          const dot = AGENT_DOT[quest.agent] || AGENT_DOT.nexa
          return (
            <label
              key={quest.title}
              className="flex items-center gap-2.5 cursor-pointer group py-0.5"
            >
              <div
                onClick={() => toggleQuest(quest.title)}
                className={`
                  w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all
                  ${quest.completed
                    ? 'bg-nexa-gold border-nexa-gold'
                    : 'bg-transparent border-nexa-muted group-hover:border-nexa-gold/60'}
                `}
              >
                {quest.completed && (
                  <svg className="w-2.5 h-2.5 text-nexa-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <span
                className={`text-[12px] font-sans flex-1 transition-colors ${
                  quest.completed ? 'text-nexa-muted line-through' : 'text-nexa-text group-hover:text-white'
                }`}
                onClick={() => toggleQuest(quest.title)}
              >
                {quest.title}
              </span>

              <div className="flex items-center gap-1">
                <div className={`agent-dot ${dot}`} />
                <span className="text-[10px] font-mono text-nexa-muted">+{quest.xp}</span>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
