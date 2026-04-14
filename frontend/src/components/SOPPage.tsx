import { BookOpen, AlertTriangle, CheckCircle, Clock, Users, Phone } from 'lucide-react';
import { SLA_MATRIX, ISSUE_TYPES } from '../constants';

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="font-bold text-gray-900 text-lg mb-4 pb-2 border-b flex items-center gap-2">
        <Icon className="w-5 h-5 text-indigo-600" />
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function SOPPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600" /> SOP & Policy Document
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Standard Operating Procedures for Maintenance Team & Srijan Management — Srijan Nirvana Phase 1
        </p>
      </div>

      {/* SLA Commitments */}
      <Section title="1. SLA Commitments (Service Level Agreement)" icon={Clock}>
        <p className="text-sm text-gray-600 mb-4">
          All maintenance tickets logged through the Resident Support Portal must be acknowledged and resolved within
          the following SLA timelines. Breach of SLA automatically triggers escalation to Srijan Management.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-50">
              <tr className="text-xs text-indigo-700 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Priority</th>
                <th className="px-4 py-3 text-left">First Response</th>
                <th className="px-4 py-3 text-left">Resolution Target</th>
                <th className="px-4 py-3 text-left">Escalation At</th>
                <th className="px-4 py-3 text-left">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SLA_MATRIX.map(row => (
                <tr key={row.criticality} className={row.bgColor}>
                  <td className="px-4 py-3 font-bold"><span className={row.color}>{row.criticality}</span></td>
                  <td className="px-4 py-3 font-semibold">{row.response}</td>
                  <td className="px-4 py-3 font-semibold">{row.resolution}</td>
                  <td className="px-4 py-3 text-gray-600">{row.escalation}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {row.criticality === 'Critical' && 'Gas leak, fire, lift entrapment, total power/water outage'}
                    {row.criticality === 'High'     && 'Lift breakdown, security breach, CCTV failure, pest infestation'}
                    {row.criticality === 'Medium'   && 'Blocked drain, housekeeping lapse, partial power failure'}
                    {row.criticality === 'Low'      && 'Gym equipment, cosmetic damage, general queries'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Maintenance Team SOP */}
      <Section title="2. Maintenance Team — Standard Operating Procedure" icon={Users}>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">2.1 Ticket Acknowledgement</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>All tickets must be acknowledged within the SLA response time from creation.</li>
              <li>Acknowledge by updating ticket status to "In Progress" with your name and initial assessment.</li>
              <li>Contact the resident via the phone number provided to confirm receipt for Critical/High tickets.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">2.2 On-Site Visit Protocol</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Critical issues: Dispatch team within 15 minutes of acknowledgement.</li>
              <li>High issues: Dispatch within 1 hour of acknowledgement.</li>
              <li>Always carry proper tools, PPE, and identification when visiting resident premises.</li>
              <li>Obtain verbal confirmation from resident before entering their unit.</li>
              <li>Log all site visit findings in the ticket update section.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">2.3 Resolution & Closure</h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Mark ticket "Resolved" only after the issue is fully fixed and verified.</li>
              <li>Fill in "Resolved By", "Resolution Notes" with root cause and action taken.</li>
              <li>Obtain resident confirmation for Critical and High tickets before marking resolved.</li>
              <li>If spare parts/vendor required, add timeline update and escalate to management.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">2.4 Preventive Maintenance Schedule</h3>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr className="text-gray-500 uppercase">
                    <th className="px-3 py-2 text-left">Activity</th>
                    <th className="px-3 py-2 text-left">Frequency</th>
                    <th className="px-3 py-2 text-left">Responsible</th>
                    <th className="px-3 py-2 text-left">Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Lift inspection & lubrication', 'Monthly', 'AMC Vendor (Otis/KONE)', 'Logbook + ticket'],
                    ['Fire extinguisher check', 'Monthly', 'Safety Officer', 'Logbook'],
                    ['CCTV & intercom check', 'Weekly', 'Security Team', 'Security log'],
                    ['Pest control treatment', 'Monthly', 'Pest Control Vendor', 'Treatment report'],
                    ['Water tank cleaning', 'Quarterly', 'Plumbing Team', 'Lab test report'],
                    ['Generator (DG) servicing', 'Monthly', 'Electrical AMC Vendor', 'Service record'],
                    ['Common area deep cleaning', 'Weekly', 'Housekeeping Team', 'Checklist'],
                    ['Terrace waterproofing check', 'Bi-annually', 'Civil Team', 'Inspection report'],
                    ['Drain / sewage flushing', 'Monthly', 'Plumbing Team', 'Work order'],
                    ['Garden & landscaping', 'Weekly', 'Horticulture Team', 'Activity log'],
                    ['Security audit', 'Monthly', 'Security Manager', 'Audit report'],
                    ['Fire drill', 'Bi-annually', 'Facility Manager', 'Drill report'],
                  ].map(([act, freq, resp, rec]) => (
                    <tr key={act} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{act}</td>
                      <td className="px-3 py-2 text-indigo-700">{freq}</td>
                      <td className="px-3 py-2 text-gray-600">{resp}</td>
                      <td className="px-3 py-2 text-gray-400">{rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Escalation Matrix */}
      <Section title="3. Escalation Matrix" icon={AlertTriangle}>
        <p className="text-sm text-gray-600 mb-4">
          If any ticket is not resolved within the SLA timeline, the following escalation chain must be followed automatically:
        </p>
        <div className="space-y-3">
          {[
            { level: 'L1 — Maintenance Team', trigger: 'Ticket created', action: 'Acknowledge and attend within SLA response time', color: 'border-blue-400 bg-blue-50' },
            { level: 'L2 — Facility Manager', trigger: 'SLA escalation time breached', action: 'Review, assign vendor/specialist, update resident, notify management', color: 'border-orange-400 bg-orange-50' },
            { level: 'L3 — Srijan Management', trigger: 'Resolution SLA breached', action: 'Direct intervention, vendor escalation, penalty clause invocation', color: 'border-red-400 bg-red-50' },
            { level: 'L4 — Resident Association / RERA', trigger: 'Chronic systemic failures (3+ reoccurrences)', action: 'Formal complaint and legal escalation', color: 'border-gray-600 bg-gray-50' },
          ].map(row => (
            <div key={row.level} className={`border-l-4 rounded-r-lg p-4 ${row.color}`}>
              <p className="font-semibold text-gray-800">{row.level}</p>
              <p className="text-xs text-gray-500 mt-0.5"><span className="font-medium">Trigger:</span> {row.trigger}</p>
              <p className="text-sm text-gray-700 mt-1">{row.action}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Issue Type Reference */}
      <Section title="4. Issue Type Reference Guide" icon={CheckCircle}>
        <p className="text-sm text-gray-600 mb-4">
          The following standard issue types and sub-categories are defined in the system. Only these categories should be used for ticket classification.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(ISSUE_TYPES).map(([type, subs]) => (
            <div key={type} className="border border-gray-200 rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-sm">{type}</p>
              <ul className="mt-1 space-y-0.5">
                {subs.map(s => <li key={s} className="text-xs text-gray-500">• {s}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Emergency Contacts */}
      <Section title="5. Emergency Contacts" icon={Phone}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { role: 'Facility Manager', name: 'Srijan Nirvana FM', contact: '1800-XXX-XXXX', note: '24×7' },
            { role: 'Security Control Room', name: 'Gate Security', contact: '1800-XXX-YYYY', note: '24×7' },
            { role: 'Electrical Emergency', name: 'CESC / Electrician', contact: '19121', note: 'Grid outage' },
            { role: 'Fire Emergency', name: 'Fire Brigade', contact: '101', note: 'Any fire incident' },
            { role: 'Gas Emergency', name: 'IGL / Mahanagar Gas', contact: '1800-180-9009', note: 'Gas leak' },
            { role: 'Police', name: 'Local Police Station', contact: '100 / 112', note: 'Security breach' },
            { role: 'Ambulance / Medical', name: 'Emergency Services', contact: '108', note: 'Medical emergency' },
            { role: 'Lift Emergency (Otis)', name: 'Otis AMC Helpdesk', contact: '1800-XXX-ZZZZ', note: 'Lift entrapment' },
          ].map(c => (
            <div key={c.role} className="flex items-start gap-3 border border-gray-200 rounded-lg p-3">
              <Phone className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-gray-800">{c.role}</p>
                <p className="text-gray-500">{c.name}</p>
                <p className="text-indigo-700 font-mono font-bold">{c.contact}</p>
                <p className="text-xs text-gray-400">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="text-xs text-gray-400 text-center pb-4">
        Srijan Nirvana Phase 1 — ITSM Resident Support Portal · Version 1.0 · Effective from 2024 · Review annually
      </div>
    </div>
  );
}
