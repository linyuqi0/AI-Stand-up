import { useEffect, useState } from 'react';

export function CircularProgress({
  value,
  max = 100,
  size = 200,
  strokeWidth = 12,
  color = '#FFB6C1',
  bgColor = '#FFE8EE',
  children,
  className = '',
  animate = true,
}) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value);
  const percentage = Math.min(100, Math.max(0, (displayValue / max) * 100));

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setDisplayValue(value), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            <span className="text-4xl font-bold text-gray-800">{Math.round(percentage)}%</span>
            <span className="text-sm text-gray-500 mt-1">今日健康分</span>
          </>
        )}
      </div>
    </div>
  );
}

export function SmallCircularProgress({
  value,
  max = 100,
  size = 60,
  strokeWidth = 6,
  color = '#FFB6C1',
  bgColor = '#FFE8EE',
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: color }}>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

export default CircularProgress;
