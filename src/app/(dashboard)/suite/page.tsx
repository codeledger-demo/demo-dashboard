const suiteLayers = [
  {
    name: 'CodeLedger',
    role: 'Developer context and receipts',
    what: 'Selects task-relevant files, symbols, policy cues, validation evidence, and active receipts before an agent edits code.',
    why: 'Agents stop starting cold, reviewers can see what context was used, and releases inherit a deterministic truth trail.',
    how: 'Install CodeLedger, run activation for a task, let hooks keep the bundle fresh, then verify the work before review.',
    command: 'codeledger activate --task "add rate limiting to /api/login"',
    owner: 'Individual developer, reviewer, tech lead',
    outcome: 'Focused bundle, fresh activation status, verification result, and receipt joined by transaction ID.',
  },
  {
    name: 'FabricLedgerSDK',
    role: 'Prompt pruning and runtime safety',
    what: 'Filters the prompt/runtime loop before the coding agent acts: noisy context out, unsafe commands flagged, prompt-injection text excluded.',
    why: 'Cleaner prompts reduce token waste and bad edits. Unsafe repo text should not become an instruction just because it was nearby.',
    how: 'Wrap the agent prompt builder or runtime middleware so FabricLedgerSDK can prune, classify, and record what was allowed.',
    command: 'fabric-ledger guard prompt --transaction txn_login_rate_limit',
    owner: 'AI agent operator, platform team, security reviewer',
    outcome: 'The agent receives useful context without stale instructions, copied secrets, or unsafe shell guidance.',
  },
  {
    name: 'CFA',
    role: 'Enterprise gateway and policy control',
    what: 'Evaluates sensitive agent actions against managed policy, approvals, capability manifests, and gateway rules.',
    why: 'Some changes should require approval even when the agent has enough context to make them technically possible.',
    how: 'Route high-risk tool calls, deploy actions, or protected service changes through CFA so allow, deny, or approval-required decisions are recorded.',
    command: 'cfa gateway evaluate --transaction txn_payment_gateway',
    owner: 'Platform owner, security/compliance, engineering manager',
    outcome: 'A reviewer can trace task context to prompt/runtime evidence to enterprise gateway decision without exposing raw source.',
  },
];

const syntheticExamples = [
  {
    title: 'Sara fixes login rate limiting',
    when: 'A normal developer task on a public API route.',
    where: 'Local CLI, Claude/Codex hook, PR comment, demo dashboard.',
    flow: 'CodeLedger selects auth files and tests. FabricLedgerSDK removes stale terminal noise from the prompt. CFA stays advisory because no protected deploy path is touched.',
    result: 'The PR shows fresh context, expected tests, and a receipt instead of relying on the agent transcript.',
  },
  {
    title: 'Marcus hits a prompt-injection note',
    when: 'A repo doc contains "ignore tests" text left from an old experiment.',
    where: 'Agent wrapper and local runtime evidence store.',
    flow: 'CodeLedger finds the relevant billing files. FabricLedgerSDK excludes the unsafe instruction before it reaches the agent. CFA records a denied capability if a managed agent still tries a risky write.',
    result: 'Useful engineering context survives; bad instructions do not become agent commands.',
  },
  {
    title: 'Priya changes payment routing',
    when: 'A sensitive service change touches policy-protected payment infrastructure.',
    where: 'CFA gateway, PR annotation, audit report, release evidence pack.',
    flow: 'CodeLedger opens the task transaction. FabricLedgerSDK records prompt/runtime evidence. CFA requires approval before protected write or deploy actions continue.',
    result: 'The team can explain who approved the change, what evidence existed, and why the gateway allowed or denied it.',
  },
];

export default function SuitePage(): JSX.Element {
  return (
    <div className="space-y-6">
      <section className="border border-stone-200 bg-surface-card p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
          ContextECF Suite
        </p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="font-serif text-3xl font-bold text-stone-900">
              One evidence trail across context, prompt safety, and enterprise control
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-600">
              The demo starts with CodeLedger because that is the day-one developer workflow:
              activate a task, work with the agent, verify, and keep a receipt. FabricLedgerSDK
              adds prompt pruning and unsafe-command filtering before the agent acts. CFA adds
              managed policy, approvals, and gateway receipts when the organization needs them.
            </p>
          </div>
          <div className="border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Practice exercise
            </p>
            <ol className="mt-3 space-y-2 text-sm text-stone-700">
              <li>1. Install CodeLedger on a public repo.</li>
              <li>2. Run activation for one small task.</li>
              <li>3. Inspect the bundle and receipt.</li>
              <li>4. Review where SDK pruning and CFA policy would add value.</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {suiteLayers.map((layer) => (
          <article key={layer.name} className="border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              {layer.name}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-stone-900">{layer.role}</h2>
            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div>
                <dt className="font-semibold text-stone-800">What</dt>
                <dd className="text-stone-600">{layer.what}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-800">Why</dt>
                <dd className="text-stone-600">{layer.why}</dd>
              </div>
              <div>
                <dt className="font-semibold text-stone-800">How</dt>
                <dd className="text-stone-600">{layer.how}</dd>
              </div>
            </dl>
            <div className="mt-4 border border-stone-200 bg-stone-50 p-3">
              <p className="font-mono text-xs text-brand-primary">$ {layer.command}</p>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-500">
              <strong className="text-stone-700">Who:</strong> {layer.owner}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              <strong className="text-stone-700">Outcome:</strong> {layer.outcome}
            </p>
          </article>
        ))}
      </section>

      <section className="border border-stone-200 bg-surface-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
              Synthetic examples
            </p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">
              What a customer should expect to see
            </h2>
          </div>
          <span className="w-fit border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-500">
            Synthetic data only
          </span>
        </div>
        <div className="mt-5 grid gap-4">
          {syntheticExamples.map((example) => (
            <article key={example.title} className="border border-stone-200 bg-white p-4">
              <h3 className="text-base font-semibold text-stone-900">{example.title}</h3>
              <div className="mt-3 grid gap-3 text-sm leading-relaxed md:grid-cols-2">
                <p className="text-stone-600">
                  <strong className="text-stone-800">When:</strong> {example.when}
                </p>
                <p className="text-stone-600">
                  <strong className="text-stone-800">Where:</strong> {example.where}
                </p>
                <p className="text-stone-600 md:col-span-2">
                  <strong className="text-stone-800">How:</strong> {example.flow}
                </p>
                <p className="text-stone-600 md:col-span-2">
                  <strong className="text-stone-800">Outcome:</strong> {example.result}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
