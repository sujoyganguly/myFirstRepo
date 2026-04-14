import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, AlertTriangle, Clock } from 'lucide-react';
import { ticketsApi } from '../utils/api';
import { ISSUE_TYPE_LIST } from '../constants';
import Badge from './Badge';
import { formatDate, slaTimeRemaining, isOverdue } from '../utils/helpers';
import type { Ticket } from '../types';

const STATUS_FILTERS = ['', 'Open', 'In Progress', 'Resolved', 'Closed'];
const CRIT_FILTERS   = ['', 'Critical', 'High', 'Medium', 'Low'];

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);

  const [search,      setSearch]      = useState('');
  const [status,      setStatus]      = useState('');
  const [criticality, setCriticality] = useState('');
  const [issueType,   setIssueType]   = useState('');

  const limit = 15;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit };
      if (search)      params.search      = search;
      if (status)      params.status      = status;
      if (criticality) params.criticality = criticality;
      if (issueType)   params.issue_type  = issueType;
      const res = await ticketsApi.list(params);
      setTickets(res.tickets);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, criticality, issueType]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [search, status, criticality, issueType]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
          <p className="text-sm text-gray-500">{total} tickets found</p>
        </div>
        <Link to="/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
          + New Ticket
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ticket #, flat, description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <select value={status} onChange={e => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
            {STATUS_FILTERS.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>

          <select value={criticality} onChange={e => setCriticality(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
            {CRIT_FILTERS.map(c => <option key={c} value={c}>{c || 'All Priorities'}</option>)}
          </select>

          <select value={issueType} onChange={e => setIssueType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="">All Issue Types</option>
            {ISSUE_TYPE_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {(search || status || criticality || issueType) && (
            <button
              onClick={() => { setSearch(''); setStatus(''); setCriticality(''); setIssueType(''); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No tickets match the current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Ticket #</th>
                  <th className="px-4 py-3 text-left">Reporter / Flat</th>
                  <th className="px-4 py-3 text-left">Issue Type</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">SLA</th>
                  <th className="px-4 py-3 text-left">Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map(t => {
                  const overdue = t.status !== 'Resolved' && t.status !== 'Closed' && isOverdue(t.sla_resolution_due);
                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-indigo-50/40 cursor-pointer transition-colors ${overdue ? 'bg-red-50/40' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <Link to={`/tickets/${t.id}`} className="font-mono font-semibold text-indigo-700 hover:underline">
                          {t.ticket_number}
                        </Link>
                        {overdue && <AlertTriangle className="inline w-3 h-3 text-red-500 ml-1" />}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{t.reporter_name}</p>
                        {t.apartment_number && <p className="text-gray-400 text-xs">{t.apartment_number}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{t.issue_type}</p>
                        {t.sub_category && <p className="text-gray-400 text-xs truncate max-w-[160px]">{t.sub_category}</p>}
                      </td>
                      <td className="px-4 py-3"><Badge type="criticality" value={t.criticality} breached={overdue} /></td>
                      <td className="px-4 py-3"><Badge type="severity"    value={t.severity} /></td>
                      <td className="px-4 py-3"><Badge type="status"      value={t.status} /></td>
                      <td className="px-4 py-3">
                        {t.status === 'Resolved' || t.status === 'Closed' ? (
                          <span className="text-green-600 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Resolved
                          </span>
                        ) : (
                          <span className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-gray-500'}`}>
                            {slaTimeRemaining(t.sla_resolution_due)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                        {formatDate(t.date_reported)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
