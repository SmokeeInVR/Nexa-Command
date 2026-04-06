import { useState, useEffect, useCallback } from 'react'

// Quest hook — reads/writes shared/quest-state.json via nexa-core API
// In production: GET /api/quests → quest-state.json
//                POST /api/quests/toggle { questTitle } → updates completed flag

const MOCK_QUEST_STATE = {
  generatedAt: new Date().toISOString(),
  mainQuest: {
    title: 'Financial Freedom',
    deadline: 'December 2027',
    progress: 12,
    description: 'Own the stack. Clear the debt. Build the empire.',
  },
  bossFights: [
    {
      name: 'Debt Destroyer',
      description: 'Clear all high-interest debt',
      progress: 8,
      nextMilestone: 'Add current balances to financial.md',
    },
    {
      name: 'Revenue Engine',
      description: 'Build consistent $10K+/month income',
      progress: 22,
      nextMilestone: 'Complete 20 inspections this month',
    },
  ],
  dailyQuests: [
    { title: 'Schedule 3 Inspections', xp: 150, completed: true,  agent: 'ella'  },
    { title: 'Review Atlas Report',    xp: 50,  completed: true,  agent: 'atlas' },
    { title: 'Morning Workout',        xp: 100, completed: false, agent: 'nexa'  },
    { title: 'Post on X',             xp: 50,  completed: false, agent: 'nexa'  },
    { title: 'Check Active Queue',     xp: 75,  completed: true,  agent: 'ella'  },
  ],
  weeklyQuests: [
    { title: 'Hit Weekly Inspection Target', target: 10, current: 6,    xp: 500, completed: false },
    { title: 'Clear the Queue',              target: 6,  current: 3,    xp: 750, completed: false },
    { title: 'Workout 3x This Week',         target: 3,  current: 2,    xp: 300, completed: false },
    { title: 'Hit Weekly Revenue Target',    target: '$2,000', current: '$1,340', xp: 500, completed: false },
  ],
  weekSummary: {
    inspectionsScheduled: 6,
    inspectionsCleared: 3,
    pendingInQueue: 12,
  },
}

export function useQuests() {
  const [quests, setQuests] = useState(MOCK_QUEST_STATE)
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  useEffect(() => {
    // TODO (production): fetch quest state from nexa-core
    // async function loadQuests() {
    //   setLoading(true)
    //   try {
    //     const res = await fetch('/api/quests')
    //     if (res.ok) {
    //       const data = await res.json()
    //       setQuests(data)
    //       setLastSync(new Date())
    //     }
    //   } catch (err) { console.warn('Quest fetch failed:', err.message) }
    //   finally { setLoading(false) }
    // }
    // loadQuests()
    // const interval = setInterval(loadQuests, 60_000)
    // return () => clearInterval(interval)
    setLastSync(new Date())
  }, [])

  // Toggle a daily quest checkbox — updates local state immediately,
  // then syncs to nexa-core (which writes quest-state.json)
  const toggleQuest = useCallback((title) => {
    setQuests(prev => ({
      ...prev,
      dailyQuests: prev.dailyQuests.map(q =>
        q.title === title ? { ...q, completed: !q.completed } : q
      ),
    }))

    // TODO (production): persist toggle
    // fetch('/api/quests/toggle', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ title }),
    // })
  }, [])

  const dailyXP = quests.dailyQuests
    .filter(q => q.completed)
    .reduce((s, q) => s + q.xp, 0)

  const totalXP = quests.dailyQuests.reduce((s, q) => s + q.xp, 0)

  return { quests, loading, lastSync, toggleQuest, dailyXP, totalXP }
}
