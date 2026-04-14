import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { analyticsApi } from '../utils/api';
import { SLA_MATRIX } from '../constants';
import Badge from './Badge';
import { formatDate } from '../utils/helpers';
import type { SLAReport } from '../types';

export default function SLAMonitor() {
  const [data, setData] = useState<SLAReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.sla().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!data) return <p className="text-red-500 p-8">Failed to load SLA data.</p>;

  const { slaByType, breachedTickets } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-600" /> SLA Monitor
        </h1>
        <p className="text-sm text-gray-500 mt-1">Service Level Agreement compliance tracking — Srijan Nirvana Phase 1</p>
      </div>

      {/* SLA Matrix Definition */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">SLA Matrix — Defined Commitments</h2>
        <p className="text-sm text-gray-500 mb-4">All response and resolution times are measured from the time of ticket creation.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">First Response</th>
                <th className="px-4 py-3 text-left">Resolution Target</th>
                <th className="px-4 py-3 text-left">Escalation Trigger</th>
                <th className="px-4 py-3 text-left">Applicable Scenarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SLA_MATRIX.map(row => (
                <tr key={row.criticality} className={`${row.bgColor}`}>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${row.color}`}>{row.criticality}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{row.response}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">{row.resolution}</td>
                  <td className="px-4 py-3 text-gray-600">{row.escalation}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {row.criticality === 'Critical' && 'Gas leak, fire, complete power/water outage, trapped in lift'}
                    {row.criticality === 'High'     && 'Lift down, security breach, pest infestation, CCTV failure'}
                    {row.criticality === 'Medium'   && 'Partial service degradation, housekeeping failure, drainage block'}
                    {row.criticality === 'Low'      && 'Cosmetic issues, minor requests, general complaints'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SLA Compliance per Criticality */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">SLA Compliance by Priority</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {slaByType.map(row => {
            const compliance = row.total > 0
              ? Math.round((row.met / row.total) * 100)
              : 100;
            const avgHrs = row.avg_resolution_hours != null
              ? `${Math.round(row.avg_resolution_hours * 10) / 10}h avg`
              : '—';

            return (
              <div key={row.criticality} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-700">{row.criticality}</span>
                  {row.breached > 0
                    ? <AlertTriangle className="w-4 h-4 text-red-500" />
                    : <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
                <p className={`text-3xl font-bold ${compliance >= 80 ? 'text-green-600' : compliance >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {compliance}%
                </p>
                <div className="mt-2 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${compliance >= 80 ? 'bg-green-500' : compliance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${compliance}%` }}
                  />
                </div>
                <div className="mt-3 text-xs text-gray-500 space-y-0.5">
                  <p>Total: {row.total} | Met SLA: {row.met}</p>
                  <p className="text-red-600 font-medium">{row.breached > 0 ? `${row.breached} currently breached` : 'No active breaches'}</p>
                  <p className="flex items-center gap-1"><Clock className="w-3 h-3" /> {avgHrs} resolution</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breached Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          SLA Breached Tickets — Immediate Escalation Required
          {breachedTickets.length > 0 && (
            <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{breachedTickets.length}</span>
          )}
        </h2>

        {breachedTickets.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">No SLA breaches! All active tickets are within SLA.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider bg-red-50">
                  <th className="px-4 py-2 text-left">Ticket #</th>
                  <th className="px-4 py-2 text-left">Reporter / Flat</th>
                  <th className="px-4 py-2 text-left">Issue</th>
                  <th className="px-4 py-2 text-left">Priority</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">SLA Due</th>
                  <th className="px-4 py-2 text-left">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {breachedTickets.map(t => (
                  <tr key={t.id} className="bg-red-50/40 hover:bg-red-50">
                    <td className="px-4 py-3">
                      <Link to={`/tickets/${t.id}`} className="font-mono font-bold text-red-700 hover:underline">
                        {t.ticket_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{t.reporter_name}</p>
                      {t.apartment_number && <p className="text-xs text-gray-400">{t.apartment_number}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{t.issue_type}</td>
                    <td className="px-4 py-3"><Badge type="criticality" value={t.criticality} breached /></td>
                    <td className="px-4 py-3"><Badge type="status"      value={t.status} /></td>
                    <td className="px-4 py-3 text-red-700 font-medium text-xs">{formatDate(t.sla_resolution_due)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(t.date_reported)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
