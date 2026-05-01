import { Sidebar } from '@/components/shell/Sidebar';
import { Header } from '@/components/shell/Header';
import { configuredScenarioTriggerUrl } from '@/lib/scenario-trigger';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scenarioTriggerUrl = configuredScenarioTriggerUrl();

  return (
    <div className="flex min-h-screen">
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__SCENARIO_TRIGGER_URL__ = ${JSON.stringify(scenarioTriggerUrl)};`,
        }}
      />
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
