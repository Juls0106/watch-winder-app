'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type ChartRow = {
  t: string
  accel_x: number | null; accel_y: number | null; accel_z: number | null
  gyro_x: number | null; gyro_y: number | null; gyro_z: number | null
  roll: number; pitch: number; yaw: number
}

function Chart({ title, data, keys, colors }: {
  title: string
  data: ChartRow[]
  keys: string[]
  colors: string[]
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 15, color: '#ccc', marginBottom: 8 }}>{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="t" stroke="#888" fontSize={11} label={{ value: 'seconds', position: 'insideBottom', offset: -3, fill: '#888', fontSize: 11 }} />
          <YAxis stroke="#888" fontSize={11} />
          <Tooltip contentStyle={{ background: '#111', border: '1px solid #333' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={colors[i]} dot={false} strokeWidth={1.5} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function SessionCharts({ data }: { data: ChartRow[] }) {
  return (
    <div>
      <Chart title="Accelerometer (g)" data={data} keys={['accel_x', 'accel_y', 'accel_z']} colors={['#f97316', '#22c55e', '#3b82f6']} />
      <Chart title="Gyroscope (dps)" data={data} keys={['gyro_x', 'gyro_y', 'gyro_z']} colors={['#f97316', '#22c55e', '#3b82f6']} />
      <Chart title="Orientation — Euler angles (deg)" data={data} keys={['roll', 'pitch', 'yaw']} colors={['#f97316', '#22c55e', '#3b82f6']} />
    </div>
  )
}