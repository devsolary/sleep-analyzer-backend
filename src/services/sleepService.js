/**
 * Core sleep analysis business logic
 */

/**
 * Calculate a sleep quality score (0-100) based on session data.
 * Weights: duration 35%, stage efficiency 35%, interruptions 20%, movement 10%
 */
exports.calculateQualityScore = (session) => {
  let score = 0;

  // Duration score (ideal = 7-9 hrs)
  const hours = (session.totalDurationMinutes || 0) / 60;
  if (hours >= 7 && hours <= 9) score += 35;
  else if (hours >= 6 || hours <= 10) score += 20;
  else score += 10;

  // Sleep stage efficiency
  if (session.stages?.length) {
    const total = session.stages.reduce((s, st) => s + st.durationMinutes, 0);
    const deep = session.stages
      .filter((s) => s.stage === 'deep')
      .reduce((s, st) => s + st.durationMinutes, 0);
    const rem = session.stages
      .filter((s) => s.stage === 'rem')
      .reduce((s, st) => s + st.durationMinutes, 0);
    const awake = session.stages
      .filter((s) => s.stage === 'awake')
      .reduce((s, st) => s + st.durationMinutes, 0);

    const deepPct = (deep / total) * 100;
    const remPct  = (rem  / total) * 100;
    const awakePct = (awake / total) * 100;

    // Ideal: deep 15-25%, REM 20-25%, awake <5%
    if (deepPct >= 15 && deepPct <= 25) score += 12;
    else if (deepPct >= 10) score += 7;

    if (remPct >= 20 && remPct <= 25) score += 12;
    else if (remPct >= 15) score += 7;

    if (awakePct <= 5) score += 11;
    else if (awakePct <= 10) score += 6;
  } else {
    score += 17; // neutral if no stage data
  }

  // Interruption score
  const interruptions = session.interruptions || 0;
  if (interruptions === 0) score += 20;
  else if (interruptions <= 2) score += 13;
  else if (interruptions <= 4) score += 6;

  // Movement score (lower movement = better deep sleep)
  const movement = session.movementScore ?? 50;
  score += Math.round((1 - movement / 100) * 10);

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Calculate the recommended bedtime given a desired wake time and sleep duration.
 */
exports.recommendedBedtime = (wakeTimeStr, targetHours = 8) => {
  const [h, m] = wakeTimeStr.split(':').map(Number);
  const wakeMinutes = h * 60 + m;
  const bedMinutes = ((wakeMinutes - targetHours * 60) + 1440) % 1440;
  const bh = Math.floor(bedMinutes / 60);
  const bm = bedMinutes % 60;
  return `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`;
};

/**
 * Rate a sleep session with a human-readable label.
 */
exports.rateSession = (qualityScore) => {
  if (qualityScore >= 85) return { label: 'Excellent', emoji: '🌟' };
  if (qualityScore >= 70) return { label: 'Good',      emoji: '😊' };
  if (qualityScore >= 55) return { label: 'Fair',      emoji: '😐' };
  if (qualityScore >= 40) return { label: 'Poor',      emoji: '😴' };
  return                         { label: 'Very Poor', emoji: '😫' };
};