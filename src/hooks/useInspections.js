import { useState, useCallback } from 'react'

const MOCK_INSPECTIONS = [
  {
    woid: '884231',
    insured: 'Bruce Shapiro',
    address: '7181 E Camelback Rd #1203-1',
    city: 'Scottsdale', state: 'AZ',
    type: 'Interior High Value',
    carrier: 'Auto-Owners',
    phone: '(480) 555-0182',
    dueDate: '2026-04-10',
    assignedDate: '2026-03-29',
    status: 'InProgress',
    priority: 'High',
    assignedTo: 'ella',
    replacementCost: null,
    notes: 'Reply all to confirm',
    rentalRequired: false,
  },
  {
    woid: '884197',
    insured: 'Carol Henning',
    address: '4388 N Scottsdale Rd #2201',
    city: 'Scottsdale', state: 'AZ',
    type: 'Exterior Only',
    carrier: 'Chubb',
    phone: '(602) 555-0341',
    dueDate: '2026-04-12',
    assignedDate: '2026-03-20',
    status: 'Review',
    priority: 'Medium',
    assignedTo: 'ella',
    replacementCost: null,
    notes: 'Gate code needed',
    rentalRequired: false,
  },
  {
    woid: '884055',
    insured: 'David Reyes',
    address: '2901 W Thomas Rd',
    city: 'Phoenix', state: 'AZ',
    type: 'Cost of Construction',
    carrier: 'Nationwide',
    phone: '(623) 555-0887',
    dueDate: '2026-04-14',
    assignedDate: '2026-04-02',
    status: 'Backlog',
    priority: 'Medium',
    assignedTo: 'ella',
    replacementCost: null,
    notes: '',
    rentalRequired: false,
  },
  {
    woid: '883901',
    insured: 'Sandra Mills',
    address: '1820 W Gurley St',
    city: 'Prescott', state: 'AZ',
    type: 'Interior High Value',
    carrier: 'Auto-Owners',
    phone: '(928) 555-0214',
    dueDate: '2026-04-18',
    assignedDate: '2026-04-04',
    status: 'Backlog',
    priority: 'Low',
    assignedTo: 'ella',
    replacementCost: null,
    notes: '',
    rentalRequired: true,
  },
  {
    woid: '884312',
    insured: 'James Tran',
    address: '9620 E Thompson Peak Pkwy',
    city: 'Scottsdale', state: 'AZ',
    type: 'Interior Standard',
    carrier: 'USAA',
    phone: '(480) 555-0993',
    dueDate: '2026-04-09',
    assignedDate: '2026-03-12',
    status: 'Review',
    priority: 'Critical',
    assignedTo: 'ella',
    replacementCost: null,
    notes: 'Urgent — past due soon',
    rentalRequired: false,
  },
]

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

export function useInspections() {
  const [inspections, setInspections] = useState(MOCK_INSPECTIONS)
  const [filter, setFilter] = useState('all')

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
    STATUS_STYLES, PRIORITY_STYLES,
    approveInspection, holdInspection,
  }
}
