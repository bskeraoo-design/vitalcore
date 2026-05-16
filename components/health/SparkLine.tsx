import React from 'react';
import Svg, { Polyline, Circle, Rect } from 'react-native-svg';

interface SparkLineProps {
  data:   number[];
  color:  string;
  width?: number;
  height?: number;
  showBg?: boolean;
}

export function SparkLine({ data, color, width = 72, height = 32, showBg = true }: SparkLineProps) {
  if (!data || data.length < 2) return null;

  const max   = Math.max(...data);
  const min   = Math.min(...data);
  const range = max - min || 1;
  const padX  = 2;
  const padY  = 3;
  const step  = (width - padX * 2) / (data.length - 1);

  const pts = data.map((v, i) => ({
    x: padX + i * step,
    y: padY + (height - padY * 2) * (1 - (v - min) / range),
  }));

  const pointsStr = pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];

  return (
    <Svg width={width} height={height}>
      {showBg && (
        <Rect
          x={0} y={0}
          width={width} height={height}
          rx={6} ry={6}
          fill={color}
          fillOpacity={0.08}
        />
      )}
      <Polyline
        points={pointsStr}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={last.x} cy={last.y} r={2.5} fill={color} />
    </Svg>
  );
}
