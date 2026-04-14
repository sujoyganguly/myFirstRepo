import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, Home, Building2, ChevronRight } from 'lucide-react';
import { ticketsApi } from '../utils/api';
import {
  CATEGORY_OPTIONS,
  PERSONAL_ISSUE_TYPES,
  PERSONAL_ISSUE_TYPE_LIST,
  COMMON_AREAS,
  COMMON_AREA_LIST,
  CRITICALITY_OPTIONS,
  SEVERITY_OPTIONS,
  suggestCriticality,
} from '../constants';
import type { CreateTicketPayload, Criticality, Severity, Category } from '../types';

const EMPTY: CreateTicketPayload = {
  reporter_name:    '',
  apartment_number: '',
  contact_number:   '',
  category:         'Personal',
  area:             '',
  issue_type:       '',
  sub_category:     '',
  criticality:      'Medium',
  severity:         'S3',
  description:      '',
};

const SLA_HINT: Record<string, string> = {
  Critical: 'First response within 30 min · Resolved within 4 hours',
  High:     'First response within 2 hours · Resolved within 24 hours',
  Medium:   'First response within 8 hours · Resolved within 72 hours',
  Low:      'First response within 24 hours · Resolved within 7 days',
};

const SLA_BANNER_COLOR: Record<string, string> = {
  Critical: 'bg-red-50 border-red-200 text-red-700',
  High:     'bg-orange-50 border-orange-200 text-orange-700',
  Medium:   'bg-yellow-50 border-yellow-200 text-yellow-700',
  Low:      'bg-green-50 border-green-200 text-green-700',
};

export default function TicketForm() {
  const navigate = useNavigate();
  const [form, setForm]           = useState<CreateTicketPayload>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');
  const [created, setCreated]     = useState<{ ticket_number: string; id: number } | null>(null);
  // track whether user manually overrode the auto-suggested criticality
  const [critOverridden, setCritOverridden] = useState(false);

  // Derived option lists
  const facilityList  = form.category === 'Common' && form.area
    ? Object.keys(COMMON_AREAS[form.area]?.facilities ?? {})
    : [];

  const subCategoryList = form.category === 'Personal' && form.issue_type
    ? (PERSONAL_ISSUE_TYPES[form.issue_type]?.subCategories ?? [])
    : form.category === 'Common' && form.area && form.issue_type
      ? (COMMON_AREAS[form.area]?.facilities[form.issue_type]?.subCategories ?? [])
      : [];

  // Auto-suggest criticality when issue_type (or area+facility) changes
  useEffect(() => {
    if (critOverridden) return;
    if (!form.issue_type) return;
    const suggested = suggestCriticality(form.category, form.issue_type, form.area || undefined);
    // auto-set severity too: Critical→S1, High→S2, Medium→S3, Low→S4
    const autoSev: Record<string, Severity> = { Critical: 'S1', High: 'S2', Medium: 'S3', Low: 'S4' };
    setForm(f => ({ ...f, criticality: suggested, severity: autoSev[suggested] ?? 'S3' }));
  }, [form.category, form.issue_type, form.area, critOverridden]);

  function set<K extends keyof CreateTicketPayload>(field: K, value: CreateTicketPayload[K]) {
    setForm(f => {
      const next = { ...f, [field]: value };
      // cascade resets
      if (field === 'category') {
        next.area         = '';
        next.issue_type   = '';
        next.sub_category = '';
        next.criticality  = 'Medium';
        next.severity     = 'S3';
        setCritOverridden(false);
      }
      if (field === 'area') {
        next.issue_type   = '';
        next.sub_category = '';
        setCritOverridden(false);
      }
      if (field === 'issue_type') {
        next.sub_category = '';
        setCritOverridden(false);
      }
      return next;
    });
  }

  function handleCritChange(val: string) {
    setCritOverridden(true);
    setForm(f => ({ ...f, criticality: val as Criticality }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.reporter_name.trim())                         return setError('Reporter name is required.');
    if (!form.issue_type)                                   return setError('Please select an issue type / facility.');
    if (form.category === 'Common' && !form.area)           return setError('Please select the area for a Common ticket.');
    if (!form.description.trim())                           return setError('Please describe the issue.');
    setError('');
    setSubmitting(true);
    try {
      const ticket = await ticketsApi.create(form);
      setCreated({ ticket_number: ticket.ticket_number, id: ticket.id });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (created) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-green-100 p-10 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Submitted!</h2>
        <p className="text-gray-500 mb-1">Your reference number is:</p>
        <p className="text-3xl font-mono font-bold text-indigo-700 mb-4">{created.ticket_number}</p>
        <p className="text-sm text-gray-400 mb-6">
          Our maintenance team will respond as per the SLA timeline. Please save this number for tracking.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate(`/tickets/${created.id}`)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700">
            View Ticket
          </button>
          <button onClick={() => { setCreated(null); setForm(EMPTY); setCritOverridden(false); }}
            className="border border-gray-300 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-sm text-gray-500 mt-1">Srijan Nirvana Phase 1 — Resident Support Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── Reporter Info ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">Reporter Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.reporter_name}
                onChange={e => set('reporter_name', e.target.value)}
                placeholder="e.g. Amit Sharma"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apartment / Unit No.</label>
              <input type="text" value={form.apartment_number}
                onChange={e => set('apartment_number', e.target.value)}
                placeholder="e.g. B-204"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="tel" value={form.contact_number}
                onChange={e => set('contact_number', e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
          </div>
        </div>

        {/* ── Step 1: Category ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-1">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">1</span>
            Issue Category <span className="text-red-500">*</span>
          </h2>
          <p className="text-xs text-gray-400 mb-4 ml-8">Is this issue inside your apartment or in a shared/common area?</p>

          <div className="grid grid-cols-2 gap-3">
            {CATEGORY_OPTIONS.map(opt => {
              const selected = form.category === opt.value;
              return (
                <button key={opt.value} type="button"
                  onClick={() => set('category', opt.value as Category)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selected ? opt.color + ' border-opacity-100 shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-bold text-gray-900">{opt.label}</span>
                    {selected && <ChevronRight className="w-4 h-4 text-indigo-600 ml-auto" />}
                  </div>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Step 2a: Personal issue type ─────────────────────────────────── */}
        {form.category === 'Personal' && (
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">2</span>
              Issue Type &amp; Sub-Category
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">
              Select the type of problem in your unit. Sub-category and priority are pre-filled based on your selection.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              {PERSONAL_ISSUE_TYPE_LIST.map(type => {
                const selected = form.issue_type === type;
                const crit     = PERSONAL_ISSUE_TYPES[type].defaultCriticality;
                const critColor: Record<string, string> = {
                  Critical: 'text-red-600', High: 'text-orange-500',
                  Medium: 'text-yellow-600', Low: 'text-green-600',
                };
                return (
                  <button key={type} type="button"
                    onClick={() => set('issue_type', type)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selected
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                    <p className={`font-medium text-sm ${selected ? 'text-indigo-800' : 'text-gray-700'}`}>{type}</p>
                    <p className={`text-xs mt-0.5 font-semibold ${critColor[crit]}`}>{crit}</p>
                  </button>
                );
              })}
            </div>

            {form.issue_type && subCategoryList.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                <select value={form.sub_category} onChange={e => set('sub_category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">— Select specific issue —</option>
                  {subCategoryList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2b: Common area + facility ──────────────────────────────── */}
        {form.category === 'Common' && (
          <div className="bg-white rounded-xl shadow-sm border border-teal-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs font-bold mr-2">2</span>
              Common Area &amp; Facility
            </h2>
            <p className="text-xs text-gray-400 mb-4 ml-8">
              Select where the issue is located, then the specific facility or service affected.
            </p>

            {/* Area grid */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_AREA_LIST.map(area => {
                  const selected = form.area === area;
                  return (
                    <button key={area} type="button"
                      onClick={() => set('area', area)}
                      className={`p-2.5 rounded-lg border-2 text-left text-sm transition-all ${
                        selected
                          ? 'border-teal-500 bg-teal-50 shadow-sm font-semibold text-teal-800'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}>
                      {area}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Facility dropdown — appears after area is chosen */}
            {form.area && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facility / Issue Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {facilityList.map(fac => {
                    const selected = form.issue_type === fac;
                    const crit     = COMMON_AREAS[form.area]?.facilities[fac]?.defaultCriticality;
                    const critColor: Record<string, string> = {
                      Critical: 'text-red-600 bg-red-50 border-red-200',
                      High:     'text-orange-600 bg-orange-50 border-orange-200',
                      Medium:   'text-yellow-700 bg-yellow-50 border-yellow-200',
                      Low:      'text-green-700 bg-green-50 border-green-200',
                    };
                    return (
                      <button key={fac} type="button"
                        onClick={() => set('issue_type', fac)}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 text-left transition-all ${
                          selected
                            ? 'border-teal-500 bg-teal-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}>
                        <span className={`text-sm font-medium ${selected ? 'text-teal-800' : 'text-gray-700'}`}>
                          {fac}
                        </span>
                        {crit && (
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ml-2 shrink-0 ${critColor[crit]}`}>
                            {crit}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sub-category */}
            {form.issue_type && subCategoryList.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                <select value={form.sub_category} onChange={e => set('sub_category', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-none">
                  <option value="">— Select specific issue —</option>
                  {subCategoryList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Criticality + Severity ───────────────────────────────── */}
        {form.issue_type && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-1">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">3</span>
              Priority &amp; Severity
            </h2>
            {!critOverridden && (
              <p className="text-xs text-teal-700 bg-teal-50 border border-teal-200 rounded px-3 py-1.5 mb-4 ml-8 inline-block">
                Auto-suggested based on your selection — override if needed.
              </p>
            )}
            {critOverridden && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-1.5 mb-4 ml-8 inline-block">
                Manually set — differs from system suggestion.
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Criticality <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CRITICALITY_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => handleCritChange(opt.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      form.criticality === opt.value
                        ? `${opt.border} ${opt.color} shadow-sm`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs mt-0.5 opacity-80 leading-tight">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SEVERITY_OPTIONS.map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => setForm(f => ({ ...f, severity: opt.value as Severity }))}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      form.severity === opt.value
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <p className="font-semibold text-sm text-gray-800">{opt.label}</p>
                    <p className="text-xs mt-0.5 text-gray-500 leading-tight">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Description ───────────────────────────────────────────── */}
        {form.issue_type && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">4</span>
              Describe the Issue
            </h2>
            <textarea value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={5} placeholder="When did it start? How many units / people affected? Any safety concerns? Have you tried any workaround?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
          </div>
        )}

        {/* ── SLA banner ────────────────────────────────────────────────────── */}
        {form.issue_type && (
          <div className={`rounded-lg px-4 py-3 border flex items-start gap-2.5 ${SLA_BANNER_COLOR[form.criticality]}`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold">SLA for {form.criticality} priority: </span>
              {SLA_HINT[form.criticality]}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
        )}

        <button type="submit" disabled={submitting || !form.issue_type}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 disabled:opacity-50 transition-colors">
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
}
