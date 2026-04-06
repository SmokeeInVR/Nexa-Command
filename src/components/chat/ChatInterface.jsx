import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import ApprovalMessage from './ApprovalMessage'

const TABS = [
  { id: 'all',   label: 'All',   color: 'text-nexa-text'  },
  { id: 'nexa',  label: 'NEXA',  color: 'text-nexa-gold'  },
  { id: 'atlas', label: 'Atlas', color: 'text-blue-400'   },
  { id: 'ella',  label: 'Ella',  color: 'text-nexa-green' },
  { id: 'dex',   label: 'Dex',   color: 'text-nexa-amber' },
]

export default function ChatInterface({
  filteredMessages, activeTab, setActiveTab,
  input, setInput, sending, sendMessage,
  approveMessage, rejectMessage, agentMeta,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [filteredMessages])

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-nexa-border flex-shrink-0 bg-nexa-surface">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider
              transition-colors border-b-2
              ${activeTab === tab.id
                ? `${tab.color} border-nexa-gold`
                : 'text-nexa-muted border-transparent hover:text-nexa-text'}
            `}
          >
            {tab.label}
          </button>
        ))}
        <div className="ml-auto text-[10px] text-nexa-muted font-mono">
          {filteredMessages.length} msgs
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
        {filteredMessages.map(msg => (
          msg.requiresApproval
            ? <ApprovalMessage
                key={msg.id}
                message={msg}
                onApprove={approveMessage}
                onReject={rejectMessage}
              />
            : <MessageBubble
                key={msg.id}
                message={msg}
                meta={agentMeta}
              />
        ))}
        {sending && (
          <div className="flex gap-2 items-center text-nexa-muted font-mono text-xs">
            <span className="animate-blink text-nexa-gold">▋</span>
            <span>NEXA processing...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-nexa-border px-4 py-3 flex-shrink-0 bg-nexa-surface">
        <div className="flex gap-2 items-center">
          <span className="text-nexa-gold font-mono text-sm select-none">▶</span>
          <input
            className="cmd-input flex-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Message all agents... (Enter to send)"
            spellCheck={false}
            autoComplete="off"
          />
          <button
            onClick={() => input.trim() && sendMessage(input)}
            disabled={sending || !input.trim()}
            className="px-4 py-2 bg-nexa-gold hover:bg-nexa-gold/80 disabled:bg-nexa-border
                       disabled:text-nexa-muted text-nexa-black font-mono font-bold
                       text-xs uppercase tracking-wider transition-colors rounded
                       disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
