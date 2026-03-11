exports.buildSummary = (logs, days) => {
  if (!logs.length) return { avgDuration: 0, avgQuality: 0, avgScore: 0, totalLogs: 0, streak: 0 };

  const avgDuration = logs.reduce((s, l) => s + (l.duration || 0), 0) / logs.length;
  const avgQuality  = logs.reduce((s, l) => s + l.quality, 0)         / logs.length;
  const avgScore    = logs.reduce((s, l) => s + (l.score || 0), 0)    / logs.length;
  const streak      = calculateStreak(logs);

  return {
    avgDuration: +avgDuration.toFixed(1),
    avgQuality:  +avgQuality.toFixed(1),
    avgScore:    Math.round(avgScore),
    totalLogs:   logs.length,
    streak,
    period:      days,
  };
};

exports.buildTrends = (logs) => {
  return logs.map(l => ({
    date:     l.date,
    duration: l.duration,
    quality:  l.quality,
    score:    l.score,
  }));
};

function calculateStreak(logs) {
  if (!logs.length) return 0;
  let streak = 1;
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i - 1].date) - new Date(sorted[i].date)) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}