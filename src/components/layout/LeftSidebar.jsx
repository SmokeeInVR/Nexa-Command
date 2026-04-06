import NavLinks from '../nav/NavLinks'

export default function LeftSidebar({ onAgentSelect }) {
  return (
    <aside className="
      desktop-only w-[200px] bg-nexa-surface border-r border-nexa-border
      flex-col overflow-y-auto flex-shrink-0
    ">
      <div className="p-3">
        <NavLinks onAgentSelect={onAgentSelect} />
      </div>

      {/* Footer */}
      <div className="mt-auto px-4 py-3 border-t border-nexa-border">
        <p className="text-[10px] text-nexa-muted font-mono">nexa-core v0.1</p>
        <p className="text-[10px] text-nexa-muted/40 font-mono">SmokeeInVR/nexa-core</p>
      </div>
    </aside>
  )
}
