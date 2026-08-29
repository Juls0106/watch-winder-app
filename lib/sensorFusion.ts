import AHRS from 'ahrs'

type JoinedSample = {
  elapsed_ms: number
  accel_x: number | null; accel_y: number | null; accel_z: number | null
  gyro_x: number | null; gyro_y: number | null; gyro_z: number | null
}

type FusedSample = JoinedSample & {
  quat_w: number | null; quat_x: number | null; quat_y: number | null; quat_z: number | null
}

// Madgwick filter, 6-DOF (accel + gyro only, no magnetometer).
// sampleRateHz should be the session's actual measured rate (we already compute this).
export function applyMadgwickFusion(samples: JoinedSample[], sampleRateHz: number): FusedSample[] {
  const madgwick = new AHRS({
    sampleInterval: 1000 / sampleRateHz, // ms between samples
    algorithm: 'Madgwick',
    beta: 0.4, // default starting point; may need tuning once we see real output
  })

  return samples.map((s) => {
    // Skip fusion update for rows with missing gyro (unmatched join) —
    // carry the last known orientation forward instead of feeding nulls into the filter.
    if (s.gyro_x === null || s.gyro_y === null || s.gyro_z === null ||
        s.accel_x === null || s.accel_y === null || s.accel_z === null) {
      const q = madgwick.getQuaternion()
      return { ...s, quat_w: q.w, quat_x: q.x, quat_y: q.y, quat_z: q.z }
    }

    // ahrs expects gyro in rad/s; MetaWear logs gyro in dps -> convert.
    const gxRad = (s.gyro_x * Math.PI) / 180
    const gyRad = (s.gyro_y * Math.PI) / 180
    const gzRad = (s.gyro_z * Math.PI) / 180

    madgwick.update(gxRad, gyRad, gzRad, s.accel_x, s.accel_y, s.accel_z)
    const q = madgwick.getQuaternion()

    return { ...s, quat_w: q.w, quat_x: q.x, quat_y: q.y, quat_z: q.z }
  })
}