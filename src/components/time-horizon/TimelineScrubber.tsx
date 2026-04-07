'use client';

import { useState } from 'react';

interface Incident {
  date: string;
  name: string;
  severity: string;
}

interface Arc {
  name: string;
  startDate: string;
  endDate: string;
}

interface TimelineScrubberProps {
  startDate: Date;
  endDate: Date;
  incidents: Incident[];
  arcs: Arc[];
}

const arcColors = [
  'rgba(11, 110, 79, 0.12)',
  'rgba(188, 108, 37, 0.12)',
  'rgba(162, 59, 42, 0.15)',
  'rgba(188, 108, 37, 0.15)',
  'rgba(11, 110, 79, 0.10)',
  'rgba(37, 99, 235, 0.10)',
];

function dateToX(date: Date, start: Date, end: Date, width: number): number {
  const total = end.getTime() - start.getTime();
  if (total === 0) return 0;
  return ((date.getTime() - start.getTime()) / total) * width;
}

export function TimelineScrubber({ startDate, endDate, incidents, arcs }: TimelineScrubberProps) {
  const [hoveredIncident, setHoveredIncident] = useState<string | null>(null);
  const svgWidth = 900;
  const svgHeight = 60;
  const barY = 28;
  const barH = 6;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-stone-200 bg-surface-card p-4 shadow-sm">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full"
        style={{ minWidth: 600, height: 60 }}
      >
        {/* Arc backgrounds */}
        {arcs.map((arc, i) => {
          const x1 = dateToX(new Date(arc.startDate), startDate, endDate, svgWidth);
          const x2 = dateToX(new Date(arc.endDate), startDate, endDate, svgWidth);
          return (
            <g key={arc.name}>
              <rect
                x={x1}
                y={0}
                width={Math.max(x2 - x1, 1)}
                height={svgHeight}
                fill={arcColors[i % arcColors.length]}
                rx={4}
              />
              <text
                x={x1 + (x2 - x1) / 2}
                y={14}
                textAnchor="middle"
                className="fill-stone-500"
                fontSize={8}
                fontWeight={500}
              >
                {arc.name}
              </text>
            </g>
          );
        })}

        {/* Main bar */}
        <rect
          x={0}
          y={barY}
          width={svgWidth}
          height={barH}
          rx={3}
          fill="#e7e5e4"
        />

        {/* Incident markers */}
        {incidents.map((inc) => {
          const cx = dateToX(new Date(inc.date), startDate, endDate, svgWidth);
          const isCritical = inc.severity === 'critical';
          const fill = isCritical ? '#a23b2a' : '#bc6c25';
          const isHovered = hoveredIncident === inc.name;

          return (
            <g
              key={inc.name}
              onMouseEnter={() => setHoveredIncident(inc.name)}
              onMouseLeave={() => setHoveredIncident(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={cx}
                cy={barY + barH / 2}
                r={isHovered ? 7 : 5}
                fill={fill}
                stroke="white"
                strokeWidth={2}
                className="transition-all duration-150"
              />
              {isHovered && (
                <g>
                  <rect
                    x={cx - 50}
                    y={barY + 14}
                    width={100}
                    height={18}
                    rx={4}
                    fill="#1c1917"
                    opacity={0.9}
                  />
                  <text
                    x={cx}
                    y={barY + 26}
                    textAnchor="middle"
                    fill="white"
                    fontSize={9}
                    fontWeight={500}
                  >
                    {inc.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
