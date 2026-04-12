/**
 * Local dev server for Vercel API functions that aren't in nexa-core.
 * Runs on port 4001.
 *
 * Usage:  node dev-api.js
 */
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

// Load .env manually (no dotenv dep needed)
const __dir = dirname(fileURLToPath(import.meta.url))
try {
  const env = readFileSync(resolve(__dir, '.env'), 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  }
} catch {}

const { default: inspectionsHandler } = await import('./api/os/inspections.js')

const PORT = 4001

const server = createServer((req, res) => {
  const cors = () => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }

  cors()
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname

  // Collect body for POST requests
  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', async () => {
    try {
      req.body = body ? JSON.parse(body) : {}
    } catch { req.body = {} }

    // Simple mock of Vercel's res object
    const mockRes = {
      _status: 200,
      _headers: {},
      status(code) { this._status = code; return this },
      setHeader(k, v) { this._headers[k] = v },
      json(data) {
        res.writeHead(this._status, { 'Content-Type': 'application/json', ...this._headers })
        res.end(JSON.stringify(data))
      },
      end() { res.writeHead(this._status, this._headers); res.end() },
    }

    if (path === '/api/os/inspections') {
      await inspectionsHandler(req, mockRes)
    } else {
      mockRes.status(404).json({ error: 'Not found' })
    }
  })
})

server.listen(PORT, () => {
  console.log(`[dev-api] listening on http://localhost:${PORT}`)
  console.log(`[dev-api] GET http://localhost:${PORT}/api/os/inspections`)
})
