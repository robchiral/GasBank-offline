import React from 'react';

export function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return <div className="empty-state">No answers yet. Start a session to see statistics.</div>;
  }
  let currentAngle = 0;
  const segments = data
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const angle = (segment.value / total) * 360;
      const start = currentAngle;
      currentAngle += angle;
      return `${segment.color} ${start}deg ${start + angle}deg`;
    })
    .join(', ');

  return (
    <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
      <div
        style={{
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `conic-gradient(${segments})`,
          border: '12px solid rgba(15, 23, 42, 0.85)',
          boxShadow: '0 12px 30px rgba(8, 20, 33, 0.5)'
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {data.map((segment) => (
          <div key={segment.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: '4px',
                background: segment.color
              }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{segment.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{segment.value} questions</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryBars({ breakdown }) {
  if (!breakdown.length) {
    return <div className="empty-state">No questions available.</div>;
  }

  return (
    <div className="chart">
      {breakdown.map((row) => (
        <div key={row.category} className="bar-row">
          <div className="bar-label">{row.category}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${row.ratio}%` }} />
          </div>
          <div style={{ width: 40, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.ratio}%</div>
        </div>
      ))}
    </div>
  );
}
