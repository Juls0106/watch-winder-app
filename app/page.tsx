import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: sessions } = await supabaseAdmin
    .from('sessions')
    .select('id, activity_label, wrist, recorded_at, duration_s, sample_rate_hz')
    .order('recorded_at', { ascending: false })

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: 24, fontFamily: 'sans-serif', color: '#eee' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Watch Winder Dataset</h1>
        <p style={{ color: '#888', marginBottom: 20 }}>Wrist motion capture & analysis</p>
        <Link href="/upload" style={{
          display: 'inline-block', padding: '12px 28px', borderRadius: 8,
          background: '#f97316', color: '#000', fontWeight: 600, textDecoration: 'none',
        }}>
          Upload Session
        </Link>
      </div>

      <h2 style={{ fontSize: 16, color: '#aaa', marginBottom: 12 }}>Sessions</h2>

      {(!sessions || sessions.length === 0) && (
        <p style={{ color: '#666', fontSize: 14 }}>No sessions uploaded yet.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sessions?.map((s) => (
          <Link key={s.id} href={`/sessions/${s.id}`} style={{
            display: 'block', padding: '12px 16px', borderRadius: 8,
            background: '#111', border: '1px solid #333', color: '#eee', textDecoration: 'none',
          }}>
            <div style={{ fontWeight: 600 }}>{s.activity_label}</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
              {s.wrist} wrist · {s.duration_s?.toFixed(1)}s · {s.sample_rate_hz?.toFixed(1)} Hz
              {s.recorded_at ? ` · ${new Date(s.recorded_at).toLocaleString()}` : ''}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}