import LiveClock from '../topbar/LiveClock'
import AgentStatusDots from '../topbar/AgentStatusDots'
import CommandInput from '../topbar/CommandInput'

export default function TopBar({ agents, onSend }) {
  return (
    <header className="
      h-16 bg-nexa-black border-b border-nexa-border
      flex items-center justify-between px-5 gap-6
      flex-shrink-0 relative z-10
    ">
      {/* Logo */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-nexa-gold/10 border border-nexa-gold/30 flex items-center justify-center">
          <span className="text-nexa-gold font-bold text-base font-mono">N</span>
        </div>
        <div>
          <p className="text-sm font-bold font-mono text-nexa-gold leading-none tracking-wider">NEXA OS</p>
          <p className="text-[10px] text-nexa-muted tracking-widest uppercase font-mono">Command Center</p>
        </div>
      </div>

      {/* Agent status dots */}
      <AgentStatusDots agents={agents} />

      {/* Central command input */}
      <div className="flex-1 flex justify-center">
        <CommandInput onSend={onSend} />
      </div>

      {/* Clock */}
      <LiveClock />
    </header>
  )
}
