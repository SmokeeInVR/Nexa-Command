import { useState, useEffect } from 'react'

// Arizona is UTC-7 year-round (no DST — Mountain Standard Time permanent)
const AZ_TZ = 'America/Phoenix'

function getAZTime() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: AZ_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const dateStr = now.toLocaleDateString('en-US', {
    timeZone: AZ_TZ,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    timeZone: AZ_TZ,
    weekday: 'long',
  }).format(now)

  return { timeStr, dateStr, dayOfWeek, raw: now }
}

export function useLiveClock() {
  const [clock, setClock] = useState(getAZTime)

  useEffect(() => {
    const id = setInterval(() => setClock(getAZTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return clock
}
