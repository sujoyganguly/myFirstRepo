export const ISSUE_TYPES: Record<string, string[]> = {
  'Water Supply': [
    'No water / low pressure',
    'Dirty / discoloured water',
    'Pipeline leakage',
    'Water tank overflow',
    'Borewell issue',
  ],
  'Electricity & Power': [
    'Power outage – flat',
    'Power outage – common area',
    'Frequent tripping / MCB',
    'Faulty wiring / sparks',
    'Street / parking lights not working',
    'Generator / DG not starting',
  ],
  'Lift / Elevator': [
    'Lift not working',
    'Lift stuck / trapped resident',
    'Unusual noise / vibration',
    'Door not closing properly',
    'Lift maintenance overdue',
  ],
  'Security & Access': [
    'Gate access card / fob not working',
    'CCTV camera not working',
    'Security personnel absent / misconduct',
    'Unauthorized entry / theft',
    'Intercom not working',
    'Boom barrier issue',
  ],
  'Housekeeping & Cleanliness': [
    'Garbage / bins not collected',
    'Common area not cleaned',
    'Corridor / staircase dirty',
    'Lobby / reception dirty',
    'Foul smell in common area',
  ],
  'Parking': [
    'Unauthorized parking',
    'Parking lights not working',
    'Parking marking faded',
    'Parking gate malfunction',
    'Vehicle damage in parking',
  ],
  'Common Area Maintenance': [
    'Corridor / lobby damage',
    'Terrace / rooftop issue',
    'Staircase / railing damage',
    'Signage missing / damaged',
    'Club house / recreation area issue',
  ],
  'Plumbing & Drainage': [
    'Blocked drain / sewage overflow',
    'Pipe burst / leakage',
    'Bathroom drainage issue',
    'Manhole uncovered',
    'Water logging',
  ],
  'Pest Control': [
    'Mosquitoes / insects',
    'Rodents / rats',
    'Cockroaches',
    'Termites / ants',
    'Pest control schedule missed',
  ],
  'Fire Safety': [
    'Fire extinguisher missing / expired',
    'Fire alarm not working',
    'Emergency exit blocked',
    'Fire hydrant issue',
    'Smoke detector not working',
  ],
  'Internet & Telecom': [
    'Internet outage – common area / fibre',
    'Cable TV disruption',
    'Mobile signal booster not working',
  ],
  'Gas Supply': [
    'Gas leakage',
    'Piped gas supply interrupted',
    'Gas meter issue',
  ],
  'Waste Management': [
    'Dry / wet waste bins overflowing',
    'Waste segregation not followed by staff',
    'Bulk waste not picked up',
    'E-waste disposal issue',
  ],
  'Gym & Amenities': [
    'Gym equipment broken',
    'Swimming pool maintenance',
    'Children\'s play area damage',
    'Jogging track issue',
    'Clubhouse AC / facilities down',
  ],
  'Landscaping & Garden': [
    'Tree trimming needed',
    'Garden not maintained',
    'Water feature / fountain issue',
    'Lawn mowing overdue',
  ],
  'Structural & Civil': [
    'Wall / ceiling seepage / leakage',
    'Cracks in wall / floor',
    'Waterproofing issue',
    'Paint peeling / facade damage',
    'Compound wall damage',
  ],
  'Noise & Disturbance': [
    'Neighbour noise complaint',
    'Construction noise beyond hours',
    'Common area noise',
    'Loud music / event disturbance',
  ],
  'Administrative': [
    'Maintenance bill discrepancy',
    'NOC / document request',
    'Staff misconduct complaint',
    'Visitor / contractor management',
    'General query / feedback',
  ],
};

export const ISSUE_TYPE_LIST = Object.keys(ISSUE_TYPES);

export const CRITICALITY_OPTIONS = [
  {
    value: 'Critical',
    label: 'Critical',
    description: 'Life safety risk or complete service failure affecting all residents',
    color: 'bg-red-600 text-white',
    border: 'border-red-500',
  },
  {
    value: 'High',
    label: 'High',
    description: 'Significant disruption to daily life requiring urgent resolution',
    color: 'bg-orange-500 text-white',
    border: 'border-orange-400',
  },
  {
    value: 'Medium',
    label: 'Medium',
    description: 'Moderate inconvenience; planned resolution is acceptable',
    color: 'bg-yellow-500 text-black',
    border: 'border-yellow-400',
  },
  {
    value: 'Low',
    label: 'Low',
    description: 'Minor issue or cosmetic; no immediate functional impact',
    color: 'bg-green-500 text-white',
    border: 'border-green-400',
  },
] as const;

export const SEVERITY_OPTIONS = [
  {
    value: 'S1',
    label: 'S1 – Blocker',
    description: 'Complete service unavailable; immediate action required',
  },
  {
    value: 'S2',
    label: 'S2 – Major',
    description: 'Major degradation; workaround difficult',
  },
  {
    value: 'S3',
    label: 'S3 – Minor',
    description: 'Partial impact; workaround available',
  },
  {
    value: 'S4',
    label: 'S4 – Cosmetic',
    description: 'No functional impact; aesthetic or minor issue',
  },
] as const;

export const SLA_MATRIX = [
  {
    criticality: 'Critical',
    response: '30 minutes',
    resolution: '4 hours',
    escalation: '2 hours',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    criticality: 'High',
    response: '2 hours',
    resolution: '24 hours',
    escalation: '12 hours',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    criticality: 'Medium',
    response: '8 hours',
    resolution: '72 hours (3 days)',
    escalation: '48 hours',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    criticality: 'Low',
    response: '24 hours',
    resolution: '7 days',
    escalation: '5 days',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
];

export const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'Open',        label: 'Open',        color: 'bg-blue-100 text-blue-800' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
  { value: 'Resolved',    label: 'Resolved',    color: 'bg-green-100 text-green-800' },
  { value: 'Closed',      label: 'Closed',      color: 'bg-gray-100 text-gray-700' },
];

export const CRITICALITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-100 text-red-800',
  High:     'bg-orange-100 text-orange-800',
  Medium:   'bg-yellow-100 text-yellow-800',
  Low:      'bg-green-100 text-green-800',
};

export const CHART_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];
