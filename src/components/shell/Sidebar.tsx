'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  sub?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Engineering Intelligence',
    items: [
      {
        label: 'Health', href: '/health', icon: 'pulse',
        sub: [
          { label: 'Team Health', href: '/team-health', icon: 'pulse' },
          { label: 'Quality', href: '/quality', icon: 'star' },
          { label: 'Agent Performance', href: '/agents', icon: 'zap' },
        ],
      },
      {
        label: 'Value', href: '/value-overview', icon: 'dollar',
        sub: [
          { label: 'Value Breakdown', href: '/value', icon: 'dollar' },
          { label: 'Efficiency', href: '/efficiency', icon: 'zap' },
          { label: 'Knowledge', href: '/knowledge', icon: 'brain' },
          { label: 'Patterns', href: '/golden-patterns', icon: 'star' },
        ],
      },
      {
        label: 'Ship', href: '/ship', icon: 'shield',
        sub: [
          { label: 'Integrity Trinity', href: '/integrity-overview', icon: 'shield' },
          { label: 'Doctrine', href: '/doctrine', icon: 'shield' },
          { label: 'Shadow', href: '/shadow', icon: 'zap' },
          { label: 'Release Gates', href: '/release-gates', icon: 'shield' },
          { label: 'CIC History', href: '/cic-history', icon: 'check' },
        ],
      },
      {
        label: 'Watch', href: '/watch', icon: 'alert',
        sub: [
          { label: 'Incidents', href: '/incidents', icon: 'alert' },
          { label: 'Drift Map', href: '/drift-map', icon: 'map' },
          { label: 'Truth Timeline', href: '/truth-timeline', icon: 'shield' },
          { label: 'Trust Layers', href: '/trust-layers', icon: 'layers' },
          { label: 'Explain', href: '/explain', icon: 'book' },
          { label: 'Next Actions', href: '/next-actions', icon: 'zap' },
        ],
      },
      {
        label: 'Time Horizon', href: '/time-horizon', icon: 'clock',
      },
    ],
  },
  {
    title: 'Enterprise',
    items: [
      { label: 'Fleet Insights', href: '/fleet', icon: 'globe' },
    ],
  },
  {
    title: 'Execution Memory',
    items: [
      { label: 'Terminal Replay', href: '/replay', icon: 'terminal' },
    ],
  },
  {
    title: 'Demo',
    items: [
      { label: 'Sandbox', href: '/sandbox', icon: 'terminal' },
      { label: 'Scenario Trigger', href: '/trigger', icon: 'terminal' },
    ],
  },
];

const iconMap: Record<string, string> = {
  pulse: 'M3 12h4l3-9 4 18 3-9h4',
  check: 'M5 13l4 4L19 7',
  shield: 'M12 2l7 4v6c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V6l7-4z',
  book: 'M4 19V5a2 2 0 012-2h8a2 2 0 012 2v14l-5-3-5 3z',
  clock: 'M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z',
  map: 'M3 7l6-3 6 3 6-3v14l-6 3-6-3-6 3V7z',
  alert: 'M12 9v4m0 4h.01M12 2L2 20h20L12 2z',
  terminal: 'M4 17l6-6-6-6M12 19h8',
  globe: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6',
  star: 'M12 2l3 7h7l-6 4 2 8-6-5-6 5 2-8-6-4h7z',
  brain: 'M12 2a4 4 0 00-4 4v2a3 3 0 00-3 3v2a3 3 0 003 3v2a4 4 0 004 4 4 4 0 004-4v-2a3 3 0 003-3v-2a3 3 0 00-3-3V6a4 4 0 00-4-4z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  layers: 'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5',
};

function NavIcon({ icon }: { icon: string }) {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d={iconMap[icon] ?? ''} />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 flex-col bg-surface-sidebar text-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent text-sm font-bold">CL</div>
        <div>
          <div className="text-sm font-semibold">CodeLedger</div>
          <div className="text-xs text-emerald-300/60">Synthetic Demo</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">{section.title}</div>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`) ||
                  item.sub?.some((s) => pathname === s.href || pathname?.startsWith(`${s.href}/`));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? 'bg-brand-primary/30 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <NavIcon icon={item.icon} />
                      {item.label}
                    </Link>
                    {item.sub && isActive && (
                      <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                        {item.sub.map((sub) => {
                          const subActive = pathname === sub.href || pathname?.startsWith(`${sub.href}/`);
                          return (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                className={`block rounded-md px-2 py-1 text-xs transition-colors ${
                                  subActive ? 'text-white font-medium' : 'text-white/50 hover:text-white/80'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-xs text-white/40">
        Read-only demo instance
      </div>
    </aside>
  );
}
