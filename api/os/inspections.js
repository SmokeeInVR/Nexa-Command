import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1CHegG80MzV8mYNXlyonLaqEAsBMCwVk_rMFK_5NV2LA'
const SHEET_NAME = 'Pending_Scheduling'

// Columns: A=WOID, B=Insured, C=Address, D=Type, E=Carrier, F=Phone, G=DueDate, K=Status
// Row indices (0-based):          0        1         2         3        4        5      6       10

function parseRow(row) {
  const get = (i) => (row[i] || '').toString().trim()
  return {
    woid:      get(0),
    insured:   get(1),
    address:   get(2),
    type:      get(3),
    carrier:   get(4),
    phone:     get(5),
    dueDate:   get(6),
    status:    get(10) || 'Backlog',
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const saJson = process.env.GOOGLE_SERVICE_ACCOUNT
    if (!saJson) throw new Error('GOOGLE_SERVICE_ACCOUNT env var not set')

    const credentials = JSON.parse(saJson)

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:K`,  // Skip header row
    })

    const rows = response.data.values || []
    const inspections = rows
      .map(parseRow)
      .filter(r => r.woid)  // Skip blank rows

    return res.status(200).json({ inspections })
  } catch (err) {
    console.error('[inspections] error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
