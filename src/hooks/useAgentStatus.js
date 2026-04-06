import { useState, useEffect, useCallback } from 'react'

// Agent status derived from tailing agent-transcript.jsonl
// In production: poll /api/transcript or SSE stream from nexa-core bridge
// Status values: 'online' | 'working' | 'idle' | 'error' | 'offline'

const AGENT_COLORS = {
  nexa:  'nexa',
  atlas: 'atlas',
  ella:  'ella',
  dex:   'dex',
}

const MOCK_INITIAL = [
  { id: 'nexa',  name: 'NEXA',  role: 'Orchestrator',     status: 'online',   lastSeen: 'just now',     activity: 'Monitoring systems' },
  { id: 'atlas', name: 'Atlas', role: 'Schedule Coord.',  status: 'idle',     lastSeen: '4 min ago',    activity: 'Morning sync complete' },
  { id: 'ella',  name: 'Ella',  role: 'Insp. Scheduler',  status: 'working',  lastSeen: 'just now',     activity: 'Drafting outreach' },
  { id: 'dex',   name: 'Dex',   role: 'Code Debugger',    status: 'idle',     lastSeen: '12 min ago',   activity: 'Watching error logs' },
]

export function useAgentStatus() {
  const [agents, setAgents] = useState(MOCK_INITIAL)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Parse a transcript entry and update the matching agent's status
  const applyTranscriptEntry = useCallback((entry) => {
    if (!entry?.agent) return
    setAgents(prev => prev.map(a => {
      if (a.id !== entry.agent) return a
      const status =
        entry.status === 'error'   ? 'error'   :
        entry.status === 'working' ? 'working' :
        entry.activity === 'idle'  ? 'idle'    : 'online'
      return {
        ...a,
        status,
        activity: (entry.message || '').slice(0, 60),
        lastSeen: 'just now',
      }
    }))
    setLastUpdate(new Date())
  }, [])

  useEffect(() => {
    // TODO (production): poll GET /api/transcript/latest every 10s
    // and call applyTranscriptEntry for each new line parsed from JSONL.
    //
    // Example integration:
    // const poll = setInterval(async () => {
    //   const res = await fetch('/api/transcript/latest')
    //   const lines = await res.json()
    //   lines.forEach(applyTranscriptEntry)
    // }, 10_000)
    // return () => clearInterval(poll)

    // Mock: cycle Ella's status to simulate real activity
    const sim = setInterval(() => {
      const activities = [
        { activity: 'Drafting outreach for WOID 884231', status: 'working' },
        { activity: 'Waiting for Marcel approval',        status: 'idle'    },
        { activity: 'Reading Pending Scheduling tab',     status: 'working' },
        { activity: 'Morning draft complete',             status: 'idle'    },
      ]
      const pick = activities[Math.floor(Math.random() * activities.length)]
      setAgents(prev => prev.map(a =>
        a.id === 'ella' ? { ...a, ...pick, lastSeen: 'just now' } : a
      ))
    }, 8000)

    return () => clearInterval(sim)
  }, [applyTranscriptEntry])

  return { agents, lastUpdate, applyTranscriptEntry, AGENT_COLORS }
}
