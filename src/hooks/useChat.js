import { useState, useCallback, useRef } from 'react'

const AGENT_META = {
  nexa:   { color: 'text-nexa-gold',    bg: 'bg-nexa-gold/10',    border: 'border-nexa-gold/30',    orb: 'bg-nexa-gold text-nexa-black'    },
  atlas:  { color: 'text-blue-400',     bg: 'bg-blue-500/10',     border: 'border-blue-500/30',     orb: 'bg-blue-500 text-white'          },
  ella:   { color: 'text-nexa-green',   bg: 'bg-nexa-green/10',   border: 'border-nexa-green/30',   orb: 'bg-nexa-green text-nexa-black'   },
  dex:    { color: 'text-nexa-amber',   bg: 'bg-nexa-amber/10',   border: 'border-nexa-amber/30',   orb: 'bg-nexa-amber text-nexa-black'   },
  system: { color: 'text-nexa-muted',   bg: 'bg-nexa-border/60',  border: 'border-nexa-border',     orb: 'bg-nexa-border text-nexa-muted'  },
  user:   { color: 'text-nexa-gold',    bg: 'bg-nexa-gold/10',    border: 'border-nexa-gold/30',    orb: 'bg-nexa-gold/20 text-nexa-gold'  },
}

const MOCK_MESSAGES = [
  {
    id: 1, agent: 'system', type: 'system',
    content: 'NEXA OS Command Center initialized. All agents online.',
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: 2, agent: 'atlas', type: 'report',
    content: 'MORNING SYNC — Sunday, April 6, 2026\n─────────────────────\nNo drafts pending approval.\nCalendar today: 2 events\n  09:00 — Inspection: 7181 E Camelback Rd #1203\n  14:00 — Inspection: 4388 N Scottsdale Rd\n\nROUTING: Both inspections in Scottsdale corridor. Same-day routing confirmed.',
    timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
  },
  {
    id: 3, agent: 'ella', type: 'draft',
    content: 'Draft ready for [WOID 884231] Bruce Shapiro — 7181 E Camelback Rd #1203-1, Scottsdale AZ.\n\nCarrier: Auto-Owners | Type: Interior High Value\nDue: Apr 10, 2026\n\nOutreach draft:\n"Hello. This is your Auto-Owners representative, Marcel Govan. I am texting to schedule the insurance survey for your home at 7181 E Camelback Rd #1203-1. Do either of these times work: 1) Mon Apr 7 · 10:00 AM  2) Tue Apr 8 · 1:00 PM"',
    timestamp: new Date(Date.now() - 9 * 60000).toISOString(),
    requiresApproval: true,
    woid: '884231',
  },
  {
    id: 4, agent: 'nexa', type: 'message',
    content: 'Ella has 3 files in draft state. Active Queue has 7 files awaiting Marcel review. Inspection queue clear by Friday if current pace holds.',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 5, agent: 'dex', type: 'alert',
    content: 'Watching bridge error logs. No errors in last 6 hours. DeepSeek Coder v2 online at localhost:11434. Ready.',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
  },
]

export function useChat() {
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [activeTab, setActiveTab] = useState('all')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const nextId = useRef(MOCK_MESSAGES.length + 1)

  const agentMeta = AGENT_META

  const filteredMessages = activeTab === 'all'
    ? messages
    : messages.filter(m => m.agent === activeTab || m.type === 'system')

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return
    setSending(true)

    const userMsg = {
      id: nextId.current++,
      agent: 'user',
      type: 'message',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const nexaReply = {
        id: nextId.current++,
        agent: 'nexa',
        type: 'message',
        content: `Received. Processing: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, nexaReply])
      setSending(false)
    }, 800)
  }, [])

  const approveMessage = useCallback((msgId) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, approved: true, approvedAt: new Date().toISOString() } : m
    ))
  }, [])

  const rejectMessage = useCallback((msgId) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId ? { ...m, rejected: true } : m
    ))
  }, [])

  return {
    messages, filteredMessages, activeTab, setActiveTab,
    input, setInput, sending, sendMessage,
    approveMessage, rejectMessage, agentMeta,
  }
}
