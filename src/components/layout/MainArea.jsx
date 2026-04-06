import ChatInterface from '../chat/ChatInterface'

export default function MainArea({ chatProps }) {
  return (
    <main className="desktop-only flex-1 flex-col min-w-0 min-h-0 bg-nexa-black">
      {/* Panel header */}
      <div className="panel-header bg-nexa-surface border-b border-nexa-border flex-shrink-0">
        <div className="w-2 h-2 rounded-full bg-nexa-gold shadow-[0_0_6px_rgba(212,160,23,0.6)]" />
        <span className="text-xs font-mono font-bold text-nexa-text uppercase tracking-wider">
          Communication Hub
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-nexa-muted font-mono">Live · Arizona Time</span>
          <div className="w-1.5 h-1.5 rounded-full bg-nexa-green animate-pulse" />
        </div>
      </div>

      {/* Chat fills remaining space */}
      <div className="flex-1 min-h-0">
        <ChatInterface {...chatProps} />
      </div>
    </main>
  )
}
