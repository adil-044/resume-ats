'use client';

/**
 * Static product recognition UI — shows score + gaps on landing
 * (SixArm: recognition > recall). Not live data.
 */
export default function MatchArtifact({ className = '' }: { className?: string }) {
  return (
    <aside
      className={`relative w-full max-w-md ${className}`}
      aria-label="Example ATS match result"
    >
      <div className="paper-panel overflow-hidden">
        <div className="border-b border-[#1A1814]/12 px-5 py-4 flex items-center justify-between">
          <span className="font-body text-[0.7rem] uppercase tracking-[0.18em] text-[#1A1814]/55">
            Match report
          </span>
          <span className="font-mono text-xs text-[#1A1814]/45">demo</span>
        </div>

        <div className="px-5 py-6 flex items-end gap-4">
          <div>
            <p className="font-body text-[0.7rem] uppercase tracking-[0.16em] text-[#1A1814]/45 mb-2">
              Score
            </p>
            <p className="font-mono text-5xl md:text-6xl font-medium text-[#1A1814] leading-none tracking-tight">
              47
              <span className="text-2xl text-[#1A1814]/40">%</span>
            </p>
          </div>
          <div className="flex-1 pb-1">
            <div className="h-1.5 w-full rounded-full bg-[#1A1814]/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#C4785A]"
                style={{ width: '47%' }}
              />
            </div>
            <p className="font-body text-xs text-[#1A1814]/55 mt-2">Below filter threshold</p>
          </div>
        </div>

        <div className="px-5 pb-6 space-y-3">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.16em] text-[#1A1814]/45">
            Missing language
          </p>
          <div className="flex flex-wrap gap-2">
            {['Kubernetes', 'CI/CD', 'stakeholder', 'OKRs'].map((kw) => (
              <span
                key={kw}
                className="font-mono text-xs px-2.5 py-1 rounded border border-[#C4785A]/35 text-[#1A1814] bg-[#C4785A]/10"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1814] px-5 py-4 flex items-center justify-between gap-3">
          <p className="font-body text-xs text-[#EDE6D9]/70">
            Rewrite keeps your facts — maps them to the JD.
          </p>
          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#C4A574] shrink-0">
            Fix →
          </span>
        </div>
      </div>

      {/* Copper accent rim — restrained ≤10% */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[0.3rem] ring-1 ring-[#C4A574]/25"
        aria-hidden
      />
    </aside>
  );
}
