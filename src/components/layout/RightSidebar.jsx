import AgentRoster from '../sidebar/AgentRoster'
import CampaignProgress from '../sidebar/CampaignProgress'
import QuestChecklist from '../sidebar/QuestChecklist'
import InspectionQueue from '../sidebar/InspectionQueue'

export default function RightSidebar({ agents, quests, toggleQuest, dailyXP, totalXP, inspections, inspectionProps }) {
  return (
    <aside className="
      desktop-only w-[380px] bg-nexa-surface border-l border-nexa-border
      flex-col overflow-y-auto flex-shrink-0
    ">
      {/* Agent Roster */}
      <section className="p-3 border-b border-nexa-border">
        <h2 className="section-label mb-2 px-0.5">Agent Roster</h2>
        <AgentRoster agents={agents} />
      </section>

      {/* Campaign Progress */}
      <section className="p-3 border-b border-nexa-border">
        <h2 className="section-label mb-2 px-0.5">Campaign Progress</h2>
        <CampaignProgress quests={quests} />
      </section>

      {/* Daily Quest Checklist */}
      <section className="p-3 border-b border-nexa-border">
        <QuestChecklist
          dailyQuests={quests.dailyQuests}
          toggleQuest={toggleQuest}
          dailyXP={dailyXP}
          totalXP={totalXP}
        />
      </section>

      {/* Inspection Queue */}
      <section className="p-3 flex-1">
        <h2 className="section-label mb-2 px-0.5">Inspection Queue</h2>
        <InspectionQueue {...inspectionProps} />
      </section>
    </aside>
  )
}
