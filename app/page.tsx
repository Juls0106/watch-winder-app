import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ maxWidth: 480, margin: '80px auto', padding: 24, fontFamily: 'sans-serif', color: '#eee', textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Watch Winder Dataset</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>Wrist motion capture & analysis</p>
      <Link href="/upload" style={{
        display: 'inline-block', padding: '12px 28px', borderRadius: 8,
        background: '#f97316', color: '#000', fontWeight: 600, textDecoration: 'none',
      }}>
        Upload Session
      </Link>
    </main>
  )
}