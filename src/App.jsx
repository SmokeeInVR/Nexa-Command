import { useAgentStatus } from './hooks/useAgentStatus'
import { useChat } from './hooks/useChat'
import { useQuests } from './hooks/useQuests'
import { useInspections } from './hooks/useInspections'

import TopBar from './components/layout/TopBar'
import LeftSidebar from './components/layout/LeftSidebar'
import MainArea from './components/layout/MainArea'
import RightSidebar from './components/layout/RightSidebar'
import MobileApprovals from './components/mobile/MobileApprovals'
import CommandInput from './components/topbar/CommandInput'

export default function App() {
  const { agents }                      = useAgentStatus()
  const { quests, toggleQuest, dailyXP, totalXP } = useQuests()
  const {
    inspections, allInspections, counts, filter, setFilter,
    STATUS_STYLES, PRIORITY_STYLES, approveInspection, holdInspection,
  } = useInspections()
  const {
    filteredMessages, activeTab, setActiveTab,
    input, setInput, sending, sendMessage,
    approveMessage, rejectMessage, agentMeta,
  } = useChat()

  function handleAgentSelect(agentId) {
    setActiveTab(agentId)
  }

  const chatProps = {
    filteredMessages, activeTab, setActiveTab,
    input, setInput, sending, sendMessage,
    approveMessage, rejectMessage, agentMeta,
  }

  const inspectionProps = {
    inspections, counts, filter, setFilter, STATUS_STYLES, PRIORITY_STYLES,
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-nexa-black">
      <TopBar agents={agents} onSend={sendMessage} />

      {/* ── Desktop (≥ 768px) ── */}
      <div className="desktop-only flex-1 min-h-0 overflow-hidden">
        <LeftSidebar onAgentSelect={handleAgentSelect} />
        <MainArea chatProps={chatProps} />
        <RightSidebar
          agents={agents}
          quests={quests}
          toggleQuest={toggleQuest}
          dailyXP={dailyXP}
          totalXP={totalXP}
          inspections={inspections}
          inspectionProps={inspectionProps}
        />
      </div>

      {/* ── Mobile (< 768px) — field approval view ── */}
      <div className="mobile-only flex-1 flex-col min-h-0 overflow-hidden">
        <MobileApprovals
          allInspections={allInspections}
          approveInspection={approveInspection}
          holdInspection={holdInspection}
        />
        {/* Command input pinned to bottom */}
        <div className="flex-shrink-0 px-4 py-3 border-t border-nexa-border bg-nexa-surface">
          <CommandInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  )
}
