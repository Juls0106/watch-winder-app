import { supabaseAdmin } from '@/lib/supabase'
import { quaternionToEuler } from '@/lib/sensorFusion'
import SessionCharts from '@/components/SessionCharts'
import Link from 'next/link'

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (sessionError || !session) {
    return <main style={{ padding: 40, color: '#eee' }}>Session not found.</main>
  }

  const { data: samples, error: samplesError } = await supabaseAdmin
    .from('samples')
    .select('elapsed_ms, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, quat_w, quat_x, quat_y, quat_z')
    .eq('session_id', id)
    .order('elapsed_ms', { ascending: true })

  if (samplesError || !samples) {
    return <main style={{ padding: 40, color: '#eee' }}>Failed to load samples.</main>
  }

  const startMs = samples[0]?.elapsed_ms ?? 0
  const recordedAtMs = session.recorded_at ? new Date(session.recorded_at).getTime() : Date.now()

  const chartData = samples.map((s) => {
    const euler = (s.quat_w !== null && s.quat_x !== null && s.quat_y !== null && s.quat_z !== null)
      ? quaternionToEuler(s.quat_w, s.quat_x, s.quat_y, s.quat_z)
      : { roll: 0, pitch: 0, yaw: 0 }

    const offsetMs = s.elapsed_ms - startMs
    const clockTime = new Date(recordedAtMs + offsetMs)
    const t = clockTime.toLocaleTimeString('en-GB') // HH:MM:SS

    return {
      t,
      accel_x: s.accel_x, accel_y: s.accel_y, accel_z: s.accel_z,
      gyro_x: s.gyro_x, gyro_y: s.gyro_y, gyro_z: s.gyro_z,
      roll: euler.roll, pitch: euler.pitch, yaw: euler.yaw,
    }
  })

  return (
    <main style={{ maxWidth: 900, margin: '40px auto', padding: 24, fontFamily: 'sans-serif', color: '#eee' }}>
      <Link href="/" style={{ color: '#888', fontSize: 14, textDecoration: 'none' }}>← Home</Link>
      <h1 style={{ fontSize: 24, margin: '12px 0 4px' }}>{session.activity_label}</h1>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
        {session.wrist} wrist · {session.duration_s?.toFixed(1)}s · {session.sample_rate_hz?.toFixed(1)} Hz · {samples.length} samples
      </p>

      <SessionCharts data={chartData} />
    </main>
  )
}