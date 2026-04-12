import { useState, useCallback, useEffect } from 'react'

export const STATUS_STYLES = {
  Backlog:    { label: 'Backlog',      cls: 'text-nexa-muted'  },
  InProgress: { label: 'In Progress',  cls: 'text-nexa-green'  },
  Review:     { label: 'Review',       cls: 'text-nexa-amber'  },
  Done:       { label: 'Done',         cls: 'text-nexa-green'  },
}

export const PRIORITY_STYLES = {
  Critical: 'text-nexa-red',
  High:     'text-nexa-gold',
  Medium:   'text-nexa-muted',
  Low:      'text-nexa-muted/60',
}

export function daysAssigned(assignedDate) {
  if (!assignedDate) return null
  const diff = Date.now() - new Date(assignedDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Map raw status strings from the sheet to internal status keys
function normalizeStatus(raw) {
  const s = (raw || '').toLowerCase().trim()
  if (s.includes('progress') || s === 'active' || s === 'open') return 'InProgress'
  if (s.includes('review') || s === 'pending review')           return 'Review'
  if (s === 'done' || s === 'complete' || s === 'completed')     return 'Done'
  return 'Backlog'
}

export function useInspections() {
  const [inspections, setInspections] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/os/inspections')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          setInspections(
            (data.inspections || []).map(r => ({
              ...r,
              status: normalizeStatus(r.status),
            }))
          )
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = filter === 'all'
    ? inspections
    : inspections.filter(i => i.status === filter)

  const counts = {
    all:        inspections.length,
    InProgress: inspections.filter(i => i.status === 'InProgress').length,
    Review:     inspections.filter(i => i.status === 'Review').length,
    Backlog:    inspections.filter(i => i.status === 'Backlog').length,
    rental:     inspections.filter(i => i.rentalRequired).length,
  }

  const approveInspection = useCallback((woid) => {
    setInspections(prev => prev.map(i =>
      i.woid === woid ? { ...i, status: 'Done' } : i
    ))
  }, [])

  const holdInspection = useCallback((woid) => {
    setInspections(prev => prev.map(i =>
      i.woid === woid ? { ...i, status: 'Backlog', notes: i.notes ? `[HOLD] ${i.notes}` : '[HOLD]' } : i
    ))
  }, [])

  return {
    inspections: filtered,
    allInspections: inspections,
    filter, setFilter, counts,
    loading, error,
    STATUS_STYLES, PRIORITY_STYLES,
    approveInspection, holdInspection,
  }
}
