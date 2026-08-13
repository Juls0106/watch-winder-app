'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function UploadPage() {
  const [accelFile, setAccelFile] = useState<File | null>(null)
  const [gyroFile, setGyroFile] = useState<File | null>(null)
  const [activityLabel, setActivityLabel] = useState('')
  const [wrist, setWrist] = useState('right')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)

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
      const res = await fetch('/api/sessions/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setResult(data)
      setStatus('done')
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Unknown error' })
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #333', background: '#111', color: '#eee', marginTop: 4,
  }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 14, color: '#aaa', marginBottom: 14 }

  return (
    <main style={{ maxWidth: 480, margin: '40px auto', padding: 24, fontFamily: 'sans-serif', color: '#eee' }}>
      <Link href="/" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>← Home</Link>
      <h1 style={{ fontSize: 24, margin: '12px 0 20px' }}>Upload Recording Session</h1>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          CSV files (select both accel + gyro at once)
          <input type="file" accept=".csv" multiple onChange={(e) => handleAnyFiles(e.target.files)} style={inputStyle} />
        </label>

        <div style={{ fontSize: 13, color: accelFile && gyroFile ? '#4ade80' : '#666', marginBottom: 16 }}>
          {accelFile ? `✓ accel: ${accelFile.name}` : 'accel: not selected'} <br />
          {gyroFile ? `✓ gyro: ${gyroFile.name}` : 'gyro: not selected'}
        </div>

        <label style={labelStyle}>
          Activity label
          <input type="text" value={activityLabel} onChange={(e) => setActivityLabel(e.target.value)}
            placeholder="e.g. walking, typing, gestures" style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Wrist
          <select value={wrist} onChange={(e) => setWrist(e.target.value)} style={inputStyle}>
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </label>

        <label style={labelStyle}>
          Notes (optional)
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, minHeight: 60 }} />
        </label>

        <button type="submit" disabled={status === 'uploading'} style={{
          width: '100%', padding: 12, borderRadius: 8, border: 'none',
          background: status === 'uploading' ? '#555' : '#f97316', color: '#000',
          fontWeight: 600, cursor: status === 'uploading' ? 'default' : 'pointer', fontSize: 15,
        }}>
          {status === 'uploading' ? 'Uploading…' : 'Upload Session'}
        </button>
      </form>

      {result && (
        <div style={{
          marginTop: 20, padding: 14, borderRadius: 8,
          background: status === 'error' ? '#3b1414' : '#0f2e1a',
          border: `1px solid ${status === 'error' ? '#7a2222' : '#1e5c34'}`,
        }}>
          <pre style={{ margin: 0, fontSize: 13, whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  )
}