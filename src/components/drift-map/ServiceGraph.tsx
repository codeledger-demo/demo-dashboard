'use client';

import { useState } from 'react';
import { DriftOverlay } from './DriftOverlay';
import { DriftLegend } from './DriftLegend';

export interface ServiceNode {
  id: string;
  name: string;
  fileCount: number;
  driftLevel: 'low' | 'medium' | 'high';
  cicPassRate: number;
  lastCommitPersona: string;
}

export interface ServiceEdge {
  from: string;
  to: string;
  label?: string;
}

interface ServiceGraphProps {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
}

const driftFill: Record<string, string> = {
  low: '#34d399',    // emerald-400
  medium: '#fbbf24', // amber-400
  high: '#f87171',   // red-400
};

const driftStroke: Record<string, string> = {
  low: '#059669',
  medium: '#d97706',
  high: '#dc2626',
};

// Fixed positions for hub-spoke layout (center = shared-utils)
const positions: Record<string, { x: number; y: number }> = {
  'shared-utils': { x: 400, y: 260 },
  auth:           { x: 200, y: 100 },
  billing:        { x: 600, y: 100 },
  notifications:  { x: 650, y: 340 },
  reporting:      { x: 150, y: 340 },
  webhooks:       { x: 400, y: 460 },
};

const NODE_W = 140;
const NODE_H = 60;

function nodeCenterX(id: string) { return (positions[id]?.x ?? 400); }
function nodeCenterY(id: string) { return (positions[id]?.y ?? 260); }

function edgePath(from: string, to: string) {
  const x1 = nodeCenterX(from);
  const y1 = nodeCenterY(from);
  const x2 = nodeCenterX(to);
  const y2 = nodeCenterY(to);

  // Shorten line to stop at node boundary
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const pad = 40;
  const sx = x1 + (dx / dist) * pad;
  const sy = y1 + (dy / dist) * pad;
  const ex = x2 - (dx / dist) * pad;
  const ey = y2 - (dy / dist) * pad;

  return { x1: sx, y1: sy, x2: ex, y2: ey };
}

export function ServiceGraph({ nodes, edges }: ServiceGraphProps) {
  const [selected, setSelected] = useState<ServiceNode | null>(null);

  return (
    <div className="relative">
      <DriftLegend />

      <div className="relative mt-4 overflow-hidden rounded-xl border border-stone-200 bg-surface-card">
        <svg viewBox="0 0 800 540" className="w-full" style={{ minHeight: 400 }}>
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((e, i) => {
            const p = edgePath(e.from, e.to);
            return (
              <line
                key={i}
                x1={p.x1}
                y1={p.y1}
                x2={p.x2}
                y2={p.y2}
                stroke="#cbd5e1"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const pos = positions[n.id];
            if (!pos) return null;
            const x = pos.x - NODE_W / 2;
            const y = pos.y - NODE_H / 2;
            const isSelected = selected?.id === n.id;
            const size = 14 + n.fileCount * 0.8;

            return (
              <g
                key={n.id}
                onClick={() => setSelected(isSelected ? null : n)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={12}
                  fill={driftFill[n.driftLevel]}
                  fillOpacity={0.18}
                  stroke={isSelected ? driftStroke[n.driftLevel] : '#d6d3d1'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                <text
                  x={pos.x}
                  y={pos.y - 6}
                  textAnchor="middle"
                  className="fill-stone-800 text-[13px] font-semibold"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  {n.name}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 14}
                  textAnchor="middle"
                  className="fill-stone-500 text-[11px]"
                  style={{ fontSize: 11 }}
                >
                  {n.fileCount} files &middot; {n.cicPassRate}%
                </text>
                {/* Drift indicator dot */}
                <circle
                  cx={x + NODE_W - 14}
                  cy={y + 14}
                  r={size / 4}
                  fill={driftFill[n.driftLevel]}
                  stroke={driftStroke[n.driftLevel]}
                  strokeWidth={1}
                />
              </g>
            );
          })}
        </svg>

        <DriftOverlay service={selected} onClose={() => setSelected(null)} />
      </div>
    </div>
  );
}
