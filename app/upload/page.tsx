'use client'

import { useState } from 'react'

export default function UploadPage() {
  const [accelFile, setAccelFile] = useState<File | null>(null)
  const [gyroFile, setGyroFile] = useState<File | null>(null)
  const [activityLabel, setActivityLabel] = useState('')
  const [wrist, setWrist] = useState('right')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

  function handleFileSelect(files: FileList | null, setter: (f: File) => void) {
    if (!files || files.length === 0) return
    const file = files[0]
    setter(file)
  }

  // Auto-detect which selected file is accel vs gyro based on filename
  function handleAnyFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (file.name.includes('accel')) setAccelFile(file)
      else if (file.name.includes('gyro')) setGyroFile(file)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accelFile || !gyroFile || !activityLabel) {
      alert('Please select both CSV files and enter an activity label')
      return
    }

    setStatus('uploading')
    const formData = new FormData()
    formData.append('accelFile', accelFile)
    formData.append('gyroFile', gyroFile)
    formData.append('activityLabel', activityLabel)
    formData.append('wrist', wrist)
    formData.append('notes', notes)

    try {
      const res = await fetch('/api/sessions/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setResult(data)
      setStatus('done')
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Unknown error' })
      setStatus('error')
    }
  }

  return (
    <main style={{ maxWidth: 500, margin: '40px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Upload Recording Session</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Both CSVs at once (auto-detects accel/gyro by filename):
          <input
            type="file"
            accept=".csv"
            multiple
            onChange={(e) => handleAnyFiles(e.target.files)}
          />
        </label>

        <div style={{ fontSize: 13, color: '#555' }}>
          Accel file: {accelFile ? accelFile.name : 'not selected'} <br />
          Gyro file: {gyroFile ? gyroFile.name : 'not selected'}
        </div>

        <label>
          Activity label:
          <input
            type="text"
            value={activityLabel}
            onChange={(e) => setActivityLabel(e.target.value)}
            placeholder="e.g. walking, typing, gestures"
            style={{ display: 'block', width: '100%', padding: 6 }}
          />
        </label>

        <label>
          Wrist:
          <select value={wrist} onChange={(e) => setWrist(e.target.value)} style={{ display: 'block', width: '100%', padding: 6 }}>
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </label>

        <label>
          Notes (optional):
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 6 }}
          />
        </label>

        <button type="submit" disabled={status === 'uploading'} style={{ padding: 10 }}>
          {status === 'uploading' ? 'Uploading...' : 'Upload Session'}
        </button>
      </form>

      {result && (
        <pre style={{ marginTop: 20, background: '#f4f4f4', padding: 12, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  )
}