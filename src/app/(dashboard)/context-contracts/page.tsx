const data = {
  contract_violation: {
    rule_id: 'checkout-schema-required',
    rule_description:
      'All changes to billing checkout routes must include the checkout schema validator in the active bundle.',
    violated: true,
    file_triggering_rule: 'services/billing/src/routes/checkout.ts',
    required_file_missing_from_bundle: true,
    message: 'Context contract violation: checkout changes require checkout-schema in bundle.',
    wiring_authored_by: 'sara-chen-acme',
    wiring_entry_date: '2026-03-15T08:00:00Z',
  },
  cic_result: {
    outcome: 'fail',
    reason: 'context_contract_violated',
    block_message: "CIC blocked: context contract 'checkout-schema-required' not satisfied.",
  },
  remediation: {
    steps: [
      'Run `codeledger activate --task "fix checkout total calculation"` to pull in the schema file.',
      'Re-run `codeledger verify` to confirm the contract is satisfied.',
      'Commit only after the contract check passes.',
    ],
  },
} as const;

export default async function ContextContractsPage() {
  const { contract_violation, cic_result, remediation } = data;

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 md:p-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">Ship</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Context Contracts</h1>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          Structural wiring rules that enforce which files must appear in the active bundle when specific production files are edited.
          Violations block CIC before the PR is opened.
        </p>
      </div>

      {/* Violation card */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700">CONTRACT VIOLATED</span>
              <span className="font-mono text-xs text-stone-500">{contract_violation.rule_id}</span>
            </div>
            <p className="mt-3 text-sm font-medium text-stone-800">{contract_violation.message}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-stone-400">Triggering file</div>
            <div className="mt-0.5 font-mono text-xs text-stone-700">{contract_violation.file_triggering_rule}</div>
          </div>
          <div className="rounded-lg bg-white p-3">
            <div className="text-xs text-stone-400">Required file in bundle</div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600">MISSING</span>
              <span className="text-xs text-stone-500">checkout-schema validator not found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rule detail */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Rule Definition</h2>
        <p className="mt-2 text-sm text-stone-600">{contract_violation.rule_description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-stone-400">
          <span>Authored by: <span className="font-medium text-stone-600">{contract_violation.wiring_authored_by}</span></span>
          <span>Added: <span className="font-medium text-stone-600">{new Date(contract_violation.wiring_entry_date).toLocaleDateString()}</span></span>
        </div>
      </div>

      {/* CIC result */}
      <div className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">CIC Result</h2>
        <div className="mt-3 flex items-center gap-3">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase text-red-700">{cic_result.outcome}</span>
          <span className="font-mono text-xs text-stone-500">{cic_result.reason}</span>
        </div>
        <div className="mt-4 rounded-lg bg-stone-900 p-4">
          <p className="font-mono text-xs text-red-400">{cic_result.block_message}</p>
        </div>
      </div>

      {/* Remediation */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-stone-700">Remediation Steps</h2>
        <ol className="mt-4 space-y-3">
          {remediation.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                {i + 1}
              </span>
              <div className="rounded-lg bg-stone-900 px-3 py-2 flex-1">
                <p className="font-mono text-xs text-emerald-300">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
