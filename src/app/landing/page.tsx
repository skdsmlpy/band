"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { WidgetCard, ChartStub } from "@/components/widgets/WidgetCard";
import { useQuery } from "@tanstack/react-query";

async function fetcher(path: string) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("failed");
  return res.json();
}

export default function LandingPage() {
  const sys = useQuery({ queryKey: ["sys"], queryFn: () => fetcher("/api/mock/widgets/system-health"), refetchInterval: 10000 });
  const quality = useQuery({ queryKey: ["quality"], queryFn: () => fetcher("/api/mock/widgets/data-quality"), refetchInterval: 15000 });
  const compliance = useQuery({ queryKey: ["compliance"], queryFn: () => fetcher("/api/mock/widgets/compliance"), refetchInterval: 20000 });
  const cost = useQuery({ queryKey: ["cost"], queryFn: () => fetcher("/api/mock/widgets/cost"), refetchInterval: 20000 });
  const activity = useQuery({ queryKey: ["activity"], queryFn: () => fetcher("/api/mock/activity?page=1"), refetchInterval: 10000 });

  return (
    <RequireAuth>
      <AppShell>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <WidgetCard title="System Status" status={sys.data?.status ?? "green"}><div className="text-sm">{sys.data?.message ?? "OK"}</div></WidgetCard>
          <WidgetCard title="Connected Data Sources"><div className="text-3xl font-semibold">{sys.data?.sources ?? 0}</div></WidgetCard>
          <WidgetCard title="Governance Policies"><div className="text-3xl font-semibold">{compliance.data?.policies ?? 0}</div></WidgetCard>
          <WidgetCard title="Recent Activities"><div className="text-sm">{activity.data?.items?.[0]?.text ?? "No activity"}</div></WidgetCard>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <WidgetCard title="System Health" status={sys.data?.status}><ChartStub label="Health" value={sys.data?.score ?? 85} /></WidgetCard>
          <WidgetCard title="Data Quality Scores"><ChartStub label="Quality" value={quality.data?.avg ?? 78} /></WidgetCard>
          <WidgetCard title="Compliance Status"><ChartStub label="Compliance" value={compliance.data?.score ?? 92} /></WidgetCard>
          <WidgetCard title="Cost Analytics"><ChartStub label="Cost" value={cost.data?.index ?? 40} max={200} /></WidgetCard>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
