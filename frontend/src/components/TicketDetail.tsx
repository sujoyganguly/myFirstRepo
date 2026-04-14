import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle, User, MapPin, Phone } from 'lucide-react';
import { ticketsApi } from '../utils/api';
import Badge from './Badge';
import { formatDate, slaTimeRemaining, isOverdue } from '../utils/helpers';
import type { Ticket, TicketUpdate } from '../types';
import { STATUS_OPTIONS } from '../constants';

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket]   = useState<Ticket | null>(null);
  const [updates, setUpdates] = useState<TicketUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Update form state
  const [newStatus,   setNewStatus]   = useState('');
  const [notes,       setNotes]       = useState('');
  const [updatedBy,   setUpdatedBy]   = useState('');
  const [resolvedBy,  setResolvedBy]  = useState('');
  const [resNotes,    setResNotes]    = useState('');
  const [saving,      setSaving]      = useState(false);
  const [saveMsg,     setSaveMsg]     = useState('');

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const res = await ticketsApi.get(Number(id));
      setTicket(res.ticket);
      setUpdates(res.updates);
      setNewStatus(res.ticket.status);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!ticket) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const res = await ticketsApi.update(ticket.id, {
        status: newStatus,
        notes: notes || undefined,
        updated_by: updatedBy || 'Maintenance Team',
        resolved_by: resolvedBy || undefined,
        resolution_notes: resNotes || undefined,
      });
      setTicket(res.ticket);
      setUpdates(res.updates);
      setNotes('');
      setSaveMsg('Update saved successfully.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setSaveMsg('Failed to save. Please retry.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20 text-gray-400">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p>Ticket not found.</p>
        <Link to="/tickets" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">← Back to list</Link>
      </div>
    );
  }

  const overdue = ticket.status !== 'Resolved' && ticket.status !== 'Closed' && isOverdue(ticket.sla_resolution_due);
  const isResolved = ticket.status === 'Resolved' || ticket.status === 'Closed';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link to="/tickets" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to All Tickets
      </Link>

      {/* Header card */}
      <div className={`bg-white rounded-xl shadow-sm border ${overdue ? 'border-red-300' : 'border-gray-100'} p-6`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xl font-bold text-indigo-700">{ticket.ticket_number}</span>
              <Badge type="criticality" value={ticket.criticality} breached={overdue} />
              <Badge type="severity"    value={ticket.severity} />
              <Badge type="status"      value={ticket.status} />
              {overdue && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                  <AlertTriangle className="w-3 h-3" /> SLA BREACHED
                </span>
              )}
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mt-2">{ticket.issue_type}</h1>
            {ticket.sub_category && <p className="text-sm text-gray-500">{ticket.sub_category}</p>}
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>Reported: {formatDate(ticket.date_reported)}</p>
            {isResolved && ticket.resolved_date && (
              <p className="text-green-600 font-medium">Resolved: {formatDate(ticket.resolved_date)}</p>
            )}
          </div>
        </div>

        {/* Reporter info row */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
          <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" />{ticket.reporter_name}</span>
          {ticket.apartment_number && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" />{ticket.apartment_number}</span>}
          {ticket.contact_number   && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" />{ticket.contact_number}</span>}
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{ticket.description}</p>
        </div>

        {/* SLA info */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Response Due</p>
            <p className="font-medium text-gray-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-400" />
              {formatDate(ticket.sla_response_due)}
            </p>
          </div>
          <div className={`rounded-lg p-3 text-sm ${overdue ? 'bg-red-50' : 'bg-gray-50'}`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Resolution Due</p>
            <p className={`font-medium flex items-center gap-1.5 ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
              <Clock className="w-4 h-4" />
              {formatDate(ticket.sla_resolution_due)}
              <span className="text-xs opacity-70">({slaTimeRemaining(ticket.sla_resolution_due)})</span>
            </p>
          </div>
        </div>

        {/* Resolution info */}
        {isResolved && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Resolution Details</span>
            </div>
            <p className="text-sm text-gray-700"><span className="font-medium">Resolved by:</span> {ticket.resolved_by || '—'}</p>
            {ticket.resolution_notes && (
              <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Notes:</span> {ticket.resolution_notes}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">Activity Log</h2>
          {updates.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No updates yet.</p>
          ) : (
            <div className="space-y-4">
              {updates.map(u => (
                <div key={u.id} className="flex gap-3">
                  <div className="mt-1 w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">{u.notes}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>{u.updated_by}</span>
                      {u.old_status !== u.new_status && (
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                          {u.old_status} → {u.new_status}
                        </span>
                      )}
                      <span>{formatDate(u.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Update Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">Add Update</h2>
          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Update / Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Describe action taken, findings, or next steps..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Updated By</label>
              <input
                type="text"
                value={updatedBy}
                onChange={e => setUpdatedBy(e.target.value)}
                placeholder="Name / Team"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {(newStatus === 'Resolved' || newStatus === 'Closed') && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Resolved By</label>
                  <input
                    type="text"
                    value={resolvedBy}
                    onChange={e => setResolvedBy(e.target.value)}
                    placeholder="Technician / vendor name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Resolution Summary</label>
                  <textarea
                    value={resNotes}
                    onChange={e => setResNotes(e.target.value)}
                    rows={2}
                    placeholder="Root cause and fix applied..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </>
            )}

            {saveMsg && (
              <p className={`text-sm ${saveMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{saveMsg}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
