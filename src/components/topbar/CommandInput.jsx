import { useState } from 'react'

export default function CommandInput({ onSend }) {
  const [value, setValue] = useState('')

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSend(value)
        setValue('')
      }
    }
  }

  return (
    <div className="flex items-center gap-2 flex-1 max-w-xl">
      <span className="text-nexa-gold font-mono text-sm select-none">▶</span>
      <input
        className="cmd-input flex-1"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Command NEXA... (Enter to send)"
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  )
}
