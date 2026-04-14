import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { ticketsApi } from '../utils/api';
import { ISSUE_TYPES, CRITICALITY_OPTIONS, SEVERITY_OPTIONS } from '../constants';
import type { CreateTicketPayload, Criticality, Severity } from '../types';

const EMPTY: CreateTicketPayload = {
  reporter_name: '',
  apartment_number: '',
  contact_number: '',
  issue_type: '',
  sub_category: '',
  criticality: 'Medium',
  severity: 'S3',
  description: '',
};

export default function TicketForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateTicketPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<{ ticket_number: string; id: number } | null>(null);

  const subCategories = form.issue_type ? ISSUE_TYPES[form.issue_type] ?? [] : [];

  function set(field: keyof CreateTicketPayload, value: string) {
    setForm(f => ({
      ...f,
      [field]: value,
      ...(field === 'issue_type' ? { sub_category: '' } : {}),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reporter_name.trim()) return setError('Reporter name is required.');
    if (!form.issue_type)          return setError('Please select an issue type.');
    if (!form.description.trim())  return setError('Please describe the issue.');
    setError('');
    setSubmitting(true);
    try {
      const ticket = await ticketsApi.create(form);
      setCreated({ ticket_number: ticket.ticket_number, id: ticket.id });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit ticket. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-green-100 p-10 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Submitted!</h2>
        <p className="text-gray-500 mb-1">Your ticket number is:</p>
        <p className="text-3xl font-mono font-bold text-indigo-700 mb-6">{created.ticket_number}</p>
        <p className="text-sm text-gray-400 mb-6">Our maintenance team will respond as per the SLA timeline. Please save this number for tracking.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(`/tickets/${created.id}`)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            View Ticket
          </button>
          <button
            onClick={() => { setCreated(null); setForm(EMPTY); }}
            className="border border-gray-300 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-sm text-gray-500 mt-1">Srijan Nirvana Phase 1 — Resident Support Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reporter Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">Reporter Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.reporter_name}
                onChange={e => set('reporter_name', e.target.value)}
                placeholder="e.g. Amit Sharma"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apartment / Unit No.</label>
              <input
                type="text"
                value={form.apartment_number}
                onChange={e => set('apartment_number', e.target.value)}
                placeholder="e.g. B-204"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input
                type="tel"
                value={form.contact_number}
                onChange={e => set('contact_number', e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Issue Classification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">Issue Classification</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.issue_type}
                onChange={e => set('issue_type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">— Select Issue Type —</option>
                {Object.keys(ISSUE_TYPES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
              <select
                value={form.sub_category}
                onChange={e => set('sub_category', e.target.value)}
                disabled={subCategories.length === 0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">— Select Sub-Category —</option>
                {subCategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Criticality */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Criticality <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CRITICALITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('criticality', opt.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.criticality === opt.value
                      ? `${opt.border} ${opt.color} shadow-sm`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm">{opt.label}</p>
                  <p className="text-xs mt-0.5 opacity-80 leading-tight">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SEVERITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('severity', opt.value as Severity)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    form.severity === opt.value
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                  <p className="text-xs mt-0.5 text-gray-500 leading-tight">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">Issue Description</h2>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Describe the issue in detail <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={5}
            placeholder="Please describe the issue clearly — when did it start, how many units / residents are affected, any safety concerns, etc."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* SLA Notice */}
        <div className={`rounded-lg p-4 flex gap-3 ${
          form.criticality === 'Critical' ? 'bg-red-50 border border-red-200' :
          form.criticality === 'High'     ? 'bg-orange-50 border border-orange-200' :
          form.criticality === 'Medium'   ? 'bg-yellow-50 border border-yellow-200' :
                                            'bg-green-50 border border-green-200'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
            form.criticality === 'Critical' ? 'text-red-500' :
            form.criticality === 'High'     ? 'text-orange-500' :
            form.criticality === 'Medium'   ? 'text-yellow-600' : 'text-green-600'
          }`} />
          <div className="text-sm">
            <p className="font-semibold text-gray-800">SLA Commitment for {form.criticality} priority:</p>
            <p className="text-gray-600 mt-0.5">
              {form.criticality === 'Critical' && 'First response within 30 minutes · Resolved within 4 hours'}
              {form.criticality === 'High'     && 'First response within 2 hours · Resolved within 24 hours'}
              {form.criticality === 'Medium'   && 'First response within 8 hours · Resolved within 72 hours'}
              {form.criticality === 'Low'      && 'First response within 24 hours · Resolved within 7 days'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}
