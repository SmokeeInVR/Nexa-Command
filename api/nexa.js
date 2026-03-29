const BRIDGE_URL = 'https://tate-spinproof-superindignantly.ngrok-free.dev;
const BRIDGE_KEY = 'nexa-bridge-2026';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message' });

  try {
    const response = await fetch(`${BRIDGE_URL}/message`, {
      method: 'POST',
      headers: { 
  'Content-Type': 'application/json',
  'bypass-tunnel-reminder': 'true',
  'ngrok-skip-browser-warning': 'true'
},
      body: JSON.stringify({ message, key: BRIDGE_KEY }),
      signal: AbortSignal.timeout(35000)
    });
    const data = await response.json();
    return res.status(200).json({ response: data.response || data.error });
  } catch (err) {
    return res.status(502).json({ error: 'Bridge unavailable', detail: err.message });
  }
}
