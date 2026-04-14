import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Flame, Home, Building2, ShieldAlert, TrendingUp } from 'lucide-react';
import { analyticsApi } from '../utils/api';
import type { AnalyticsSummary } from '../types';
import { CHART_COLORS } from '../constants';
import { Link } from 'react-router-dom';

function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: number | string; icon: React.ElementType;
  color: string; sub?: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-5 flex items-start gap-4`}>
      <div className={`p-2 rounded-lg ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.summary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!data) return <p className="text-red-500 p-8">Failed to load analytics.</p>;

  const { summary, byCategory, byCriticality, byIssueType, byStatus, dailyTrend, avgResolutionHours, slaComplianceRate, problemAreas } = data;
  const personalCount = byCategory.find(c => c.category === 'Personal')?.count ?? 0;
  const commonCount   = byCategory.find(c => c.category === 'Common')?.count   ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Srijan Nirvana Phase 1 — Resident Support Overview</p>
        </div>
        <Link
          to="/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + New Ticket
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Tickets"   value={summary.total}      icon={TrendingUp}   color="border-indigo-600" />
        <StatCard label="Open"            value={summary.open}       icon={Clock}        color="border-blue-500" />
        <StatCard label="In Progress"     value={summary.inProgress} icon={TrendingUp}   color="border-purple-500" />
        <StatCard label="Resolved"        value={summary.resolved}   icon={CheckCircle}  color="border-green-500" />
        <StatCard label="Critical Active" value={summary.critical}   icon={Flame}        color="border-red-600" sub="Needs immediate attention" />
        <StatCard label="SLA Breached"    value={summary.breached}   icon={AlertTriangle} color="border-rose-500" sub="Escalation required" />
      </div>

      {/* Personal vs Common split */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/tickets?category=Personal"
          className="bg-white rounded-xl shadow-sm border-l-4 border-indigo-400 p-4 flex items-center gap-4 hover:bg-indigo-50/40 transition-colors">
          <div className="p-2 rounded-lg bg-indigo-100">
            <Home className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{personalCount}</p>
            <p className="text-sm text-gray-500">Personal / In-Unit Tickets</p>
          </div>
        </Link>
        <Link to="/tickets?category=Common"
          className="bg-white rounded-xl shadow-sm border-l-4 border-teal-500 p-4 flex items-center gap-4 hover:bg-teal-50/40 transition-colors">
          <div className="p-2 rounded-lg bg-teal-100">
            <Building2 className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{commonCount}</p>
            <p className="text-sm text-gray-500">Common Area / Facility Tickets</p>
          </div>
        </Link>
      </div>

      {/* SLA Compliance + Avg Resolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-800">SLA Compliance Rate</h2>
          </div>
          <div className="flex items-end gap-3">
            <span className={`text-5xl font-bold ${slaComplianceRate >= 80 ? 'text-green-600' : slaComplianceRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {slaComplianceRate}%
            </span>
            <span className="text-gray-400 mb-2 text-sm">of resolved tickets met SLA</span>
          </div>
          <div className="mt-3 bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${slaComplianceRate >= 80 ? 'bg-green-500' : slaComplianceRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${slaComplianceRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Target: ≥ 90%</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-gray-800">Avg. Resolution Time</h2>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-indigo-600">{avgResolutionHours}</span>
            <span className="text-gray-400 mb-2 text-sm">hours on average</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Across all resolved tickets</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily trend */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Ticket Volume — Last 14 Days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} name="Tickets" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By criticality donut */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Tickets by Criticality</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={byCriticality} dataKey="count" nameKey="criticality" cx="50%" cy="50%" outerRadius={80} label={({ criticality, percent }) => `${Math.round(percent * 100)}%`}>
                  {byCriticality.map((_, i) => (
                    <Cell key={i} fill={['#ef4444','#f97316','#eab308','#22c55e'][i % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {byCriticality.map((item, i) => (
                <div key={item.criticality} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: ['#ef4444','#f97316','#eab308','#22c55e'][i % 4] }} />
                  <span className="font-medium">{item.criticality}</span>
                  <span className="text-gray-400 ml-auto">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By issue type bar */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Top Issue Categories</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byIssueType} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="issue_type" width={150} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Tickets" radius={[0, 4, 4, 0]}>
                {byIssueType.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Problem areas + status */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Problem Areas (Open & High-Priority)
            </h2>
            <div className="space-y-2">
              {problemAreas.length === 0 && <p className="text-sm text-gray-400">No open issues — great work!</p>}
              {problemAreas.map((p) => (
                <div key={p.issue_type} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 truncate max-w-[180px]">{p.issue_type}</span>
                  <div className="flex gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs">{p.high_priority_count} urgent</span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{p.open_count} open</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-3">Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={byStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                  {byStatus.map((s, i) => (
                    <Cell key={i} fill={
                      s.status === 'Open' ? '#3b82f6' :
                      s.status === 'In Progress' ? '#8b5cf6' :
                      s.status === 'Resolved' ? '#22c55e' : '#9ca3af'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
