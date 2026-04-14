import type { Criticality } from '../types';

// ─── Shared facility descriptor ───────────────────────────────────────────────
export interface IssueFacility {
  subCategories: string[];
  defaultCriticality: Criticality;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export const CATEGORY_OPTIONS = [
  {
    value: 'Personal',
    label: 'Personal',
    description: 'Issue inside your apartment / unit',
    icon: '🏠',
    color: 'border-indigo-500 bg-indigo-50',
  },
  {
    value: 'Common',
    label: 'Common',
    description: 'Issue in a shared area or common facility',
    icon: '🏢',
    color: 'border-teal-500 bg-teal-50',
  },
] as const;

// ─── PERSONAL issue types ─────────────────────────────────────────────────────
// Each entry: sub-categories + auto-suggested criticality
export const PERSONAL_ISSUE_TYPES: Record<string, IssueFacility> = {
  'Electricity & Power': {
    subCategories: [
      'Complete power outage in flat',
      'Frequent MCB / breaker tripping',
      'Faulty wiring / sparks',
      'Electrical socket not working',
      'Meter / billing issue',
    ],
    defaultCriticality: 'High',
  },
  'Water Supply': {
    subCategories: [
      'No water / very low pressure',
      'Dirty / discoloured water',
      'Internal pipeline leakage',
      'Geyser / water heater issue',
    ],
    defaultCriticality: 'High',
  },
  'Plumbing & Drainage': {
    subCategories: [
      'Blocked bathroom / kitchen drain',
      'Pipe burst / leakage inside flat',
      'Toilet flush not working',
      'Sink / basin overflow',
      'Foul smell from drain',
    ],
    defaultCriticality: 'Medium',
  },
  'Gas Supply': {
    subCategories: [
      'Gas leakage smell inside flat',
      'Piped gas supply interrupted',
      'Gas meter malfunction',
      'Gas regulator issue',
    ],
    defaultCriticality: 'Critical',
  },
  'Internet & Telecom': {
    subCategories: [
      'Broadband / fibre outage',
      'Cable TV disruption',
      'OFC / cable damage',
      'Wi-Fi router / ONT issue',
    ],
    defaultCriticality: 'Low',
  },
  'Air Conditioning': {
    subCategories: [
      'AC not cooling',
      'AC leaking water inside flat',
      'AC unit making noise',
      'AC remote / thermostat issue',
      'AC outdoor unit damage',
    ],
    defaultCriticality: 'Low',
  },
  'Structural & Civil': {
    subCategories: [
      'Ceiling / wall seepage or stains',
      'Cracks in wall or floor',
      'Door / window not closing properly',
      'Flooring tile loose / broken',
      'Paint peeling inside flat',
    ],
    defaultCriticality: 'Medium',
  },
  'Pest Control': {
    subCategories: [
      'Cockroaches inside flat',
      'Ants or insects',
      'Rodents / rats inside flat',
      'Termites / white ants',
      'Mosquito breeding inside flat',
    ],
    defaultCriticality: 'Medium',
  },
  'Noise & Disturbance': {
    subCategories: [
      'Neighbour noise – music / TV',
      'Neighbour construction / drilling',
      'Noise during late hours (after 10 PM)',
      'Pet / animal noise from neighbour',
    ],
    defaultCriticality: 'Low',
  },
  'Administrative': {
    subCategories: [
      'Maintenance bill discrepancy',
      'NOC / document request',
      'Parking slot allotment issue',
      'Move-in / move-out request',
      'Visitor / contractor pass',
      'General query / feedback',
    ],
    defaultCriticality: 'Low',
  },
};

// ─── COMMON AREAS with Facilities ─────────────────────────────────────────────
// area → facility → { subCategories, defaultCriticality }
export interface CommonAreaDef {
  facilities: Record<string, IssueFacility>;
}

export const COMMON_AREAS: Record<string, CommonAreaDef> = {
  'Main Entrance & Gate': {
    facilities: {
      'Security & Access Control': {
        subCategories: [
          'Access card / fob not working',
          'Boom barrier malfunction',
          'Main gate not opening / closing',
          'Pedestrian gate issue',
          'Key pad / biometric failure',
        ],
        defaultCriticality: 'High',
      },
      'CCTV & Surveillance': {
        subCategories: [
          'Camera offline or damaged',
          'Blind spot in coverage area',
          'DVR / NVR recording failure',
          'Night vision not working',
        ],
        defaultCriticality: 'High',
      },
      'Intercom / Video Door Phone': {
        subCategories: [
          'Intercom unit not working',
          'Audio unclear / static',
          'Video not displaying',
          'Door release not functioning',
        ],
        defaultCriticality: 'Medium',
      },
      'Lighting': {
        subCategories: [
          'Entry / porch lights not working',
          'Pathway lights out',
          'Lighting insufficient for safety',
        ],
        defaultCriticality: 'Medium',
      },
    },
  },

  'Tower Lobby & Reception': {
    facilities: {
      'Housekeeping & Cleanliness': {
        subCategories: [
          'Lobby not cleaned',
          'Foul smell in lobby',
          'Dirt / debris on floor',
          'Glass / mirror dirty',
        ],
        defaultCriticality: 'Medium',
      },
      'Lighting': {
        subCategories: [
          'Lobby lights not working',
          'Lights flickering',
          'Emergency lighting dead',
        ],
        defaultCriticality: 'Medium',
      },
      'CCTV': {
        subCategories: [
          'Camera offline in lobby',
          'Camera angle not covering entry',
        ],
        defaultCriticality: 'High',
      },
      'AC / Ventilation': {
        subCategories: [
          'Lobby AC not working',
          'Foul air / poor ventilation',
          'AC leaking in lobby',
        ],
        defaultCriticality: 'Medium',
      },
    },
  },

  'Lift / Elevator': {
    facilities: {
      'Lift Not Operational': {
        subCategories: [
          'Complete breakdown',
          'Door not opening / closing',
          'Buttons not responding',
          'Lift stopping at wrong floor',
          'Overload sensor malfunction',
        ],
        defaultCriticality: 'High',
      },
      'Resident Trapped in Lift': {
        subCategories: [
          'Stuck between floors',
          'Emergency alarm button not working',
          'Intercom inside lift dead',
        ],
        defaultCriticality: 'Critical',
      },
      'Abnormal Noise / Vibration': {
        subCategories: [
          'Grinding / scraping noise',
          'Jerky or rough movement',
          'Excessive vibration',
        ],
        defaultCriticality: 'High',
      },
      'Lift Lighting / Fan': {
        subCategories: [
          'Cabin light not working',
          'Fan not working',
          'Display / indicator not working',
        ],
        defaultCriticality: 'Medium',
      },
      'AMC / Inspection Overdue': {
        subCategories: [
          'Scheduled service not done',
          'Inspection certificate expired',
          'Oil / lubrication overdue',
        ],
        defaultCriticality: 'High',
      },
    },
  },

  'Corridors & Staircases': {
    facilities: {
      'Lighting': {
        subCategories: [
          'Corridor lights not working',
          'Staircase lights out',
          'Motion-sensor light failure',
          'Emergency lighting dead',
        ],
        defaultCriticality: 'Medium',
      },
      'Housekeeping': {
        subCategories: [
          'Corridor not swept / mopped',
          'Garbage / litter on corridor',
          'Staircase dirty / dusty',
          'Foul smell on floor',
        ],
        defaultCriticality: 'Medium',
      },
      'Railing / Handrail Damage': {
        subCategories: [
          'Railing loose or broken',
          'Handrail missing on staircase',
          'Sharp / hazardous edge',
        ],
        defaultCriticality: 'High',
      },
      'Fire Exit Blocked': {
        subCategories: [
          'Fire door blocked by objects',
          'Fire exit locked / not openable',
          'Emergency signage missing',
        ],
        defaultCriticality: 'Critical',
      },
      'Water Leakage on Corridor': {
        subCategories: [
          'Water dripping from above',
          'Puddle / water logging on floor',
          'Pipe leakage on corridor wall',
        ],
        defaultCriticality: 'Medium',
      },
    },
  },

  'Basement Parking': {
    facilities: {
      'Parking Gate / Barrier': {
        subCategories: [
          'Boom barrier not lifting',
          'Gate motor failure',
          'Remote / card not working',
          'Gate damaged',
        ],
        defaultCriticality: 'Medium',
      },
      'Lighting': {
        subCategories: [
          'Parking lights not working',
          'Dark / dim area in parking',
          'Emergency lighting failure',
        ],
        defaultCriticality: 'Medium',
      },
      'CCTV': {
        subCategories: [
          'Camera offline in parking',
          'Coverage gap in parking area',
        ],
        defaultCriticality: 'High',
      },
      'Fire Safety Equipment': {
        subCategories: [
          'Fire extinguisher missing / expired',
          'Fire suppression system fault',
          'Smoke detector not working',
          'Emergency exit blocked',
        ],
        defaultCriticality: 'Critical',
      },
      'Water Logging / Flooding': {
        subCategories: [
          'Water accumulating in parking',
          'Drainage blocked in parking',
          'Seepage from above structure',
        ],
        defaultCriticality: 'High',
      },
      'Unauthorized Parking': {
        subCategories: [
          'Visitor car in resident slot',
          'Motorcycle in car parking zone',
          'Double parking blocking access',
        ],
        defaultCriticality: 'Medium',
      },
    },
  },

  'Terrace / Rooftop': {
    facilities: {
      'Waterproofing / Seepage': {
        subCategories: [
          'Water seeping through terrace slab',
          'Waterproofing coat peeling',
          'Puddle formation on terrace',
        ],
        defaultCriticality: 'Medium',
      },
      'Overhead Water Tank': {
        subCategories: [
          'Tank overflow / wastage',
          'Tank not cleaned on schedule',
          'Tank cover missing / damaged',
          'Inlet / outlet pipe issue',
        ],
        defaultCriticality: 'High',
      },
      'Drainage & Water Logging': {
        subCategories: [
          'Terrace drain blocked',
          'Standing water on terrace',
        ],
        defaultCriticality: 'Medium',
      },
      'Parapet Wall / Safety': {
        subCategories: [
          'Parapet wall damaged / cracked',
          'Low parapet – safety risk',
          'Loose brickwork / plaster falling',
        ],
        defaultCriticality: 'High',
      },
    },
  },

  'Garden & Landscaping': {
    facilities: {
      'Garden Maintenance': {
        subCategories: [
          'Garden not maintained / overgrown',
          'Lawn mowing overdue',
          'Plants wilting / dying',
          'Fertilisation / pest control missed',
        ],
        defaultCriticality: 'Low',
      },
      'Tree & Shrub Trimming': {
        subCategories: [
          'Overgrown branches blocking path',
          'Dead tree – safety hazard',
          'Hedge not trimmed',
        ],
        defaultCriticality: 'Low',
      },
      'Irrigation System': {
        subCategories: [
          'Sprinkler not working',
          'Drip line blocked / broken',
          'Over-watering causing flooding',
        ],
        defaultCriticality: 'Low',
      },
      'Garden Lighting': {
        subCategories: [
          'Garden / pathway lights out',
          'Timer not working',
        ],
        defaultCriticality: 'Low',
      },
      'Water Feature / Fountain': {
        subCategories: [
          'Fountain pump not working',
          'Water dirty / algae growth',
          'Structural damage to feature',
        ],
        defaultCriticality: 'Low',
      },
    },
  },

  'Swimming Pool': {
    facilities: {
      'Water Quality': {
        subCategories: [
          'Cloudy / green water',
          'Excessive chlorine / chemical smell',
          'pH level out of range',
          'Water not changed on schedule',
        ],
        defaultCriticality: 'High',
      },
      'Pool Pump & Filter': {
        subCategories: [
          'Pump not running',
          'Filter blocked / dirty',
          'Heating system not working',
          'Suction drain blocked',
        ],
        defaultCriticality: 'Medium',
      },
      'Safety Equipment': {
        subCategories: [
          'Life ring / rope missing',
          'Pool depth markers missing',
          'Anti-slip tiles damaged',
          'Pool gate / fence not secure',
        ],
        defaultCriticality: 'High',
      },
      'Pool Cleanliness': {
        subCategories: [
          'Debris / leaves in pool',
          'Pool tiles dirty',
          'Changing room not cleaned',
          'Pool area not maintained',
        ],
        defaultCriticality: 'Medium',
      },
    },
  },

  'Gym & Fitness Center': {
    facilities: {
      'Equipment Breakdown': {
        subCategories: [
          'Treadmill not working',
          'Weight machine damaged',
          'Cable snapped / unsafe',
          'Elliptical / cycle malfunction',
        ],
        defaultCriticality: 'Low',
      },
      'AC / Ventilation': {
        subCategories: [
          'Gym AC not working',
          'Poor ventilation / stuffy',
          'AC leaking water',
        ],
        defaultCriticality: 'Medium',
      },
      'Lighting': {
        subCategories: ['Gym lights not working', 'Insufficient lighting'],
        defaultCriticality: 'Low',
      },
      'Cleanliness & Hygiene': {
        subCategories: [
          'Gym floor not cleaned',
          'Equipment not sanitised',
          'Restroom dirty',
          'Foul smell',
        ],
        defaultCriticality: 'Low',
      },
    },
  },

  "Children's Play Area": {
    facilities: {
      'Play Equipment Damage': {
        subCategories: [
          'Swing broken / unsafe',
          'Slide damaged / sharp edge',
          'See-saw / spring ride broken',
          'Climbing frame unstable',
        ],
        defaultCriticality: 'High',
      },
      'Safety Surfacing': {
        subCategories: [
          'Rubber matting torn / missing',
          'Sand pit dirty / contaminated',
          'Hard surface exposed under equipment',
        ],
        defaultCriticality: 'High',
      },
      'Lighting': {
        subCategories: ['Play area lights not working', 'Inadequate lighting at night'],
        defaultCriticality: 'Medium',
      },
      'Cleanliness': {
        subCategories: [
          'Litter / garbage in play area',
          'Animal waste in play area',
          'Play area not cleaned',
        ],
        defaultCriticality: 'Medium',
      },
    },
  },

  'Clubhouse & Recreation': {
    facilities: {
      'AC / Power': {
        subCategories: [
          'Clubhouse AC not working',
          'Power outage in clubhouse',
          'Lights not working',
        ],
        defaultCriticality: 'Medium',
      },
      'AV & Equipment': {
        subCategories: [
          'Projector / TV not working',
          'Sound system issue',
          'Wi-Fi in clubhouse not working',
        ],
        defaultCriticality: 'Low',
      },
      'Booking & Access': {
        subCategories: [
          'Booking not honoured',
          'Clubhouse locked during booked slot',
          'Double booking conflict',
        ],
        defaultCriticality: 'Low',
      },
      'Cleanliness': {
        subCategories: [
          'Hall not cleaned after event',
          'Restroom dirty',
          'Kitchen area unhygienic',
        ],
        defaultCriticality: 'Low',
      },
    },
  },

  'Waste Management': {
    facilities: {
      'Garbage Collection': {
        subCategories: [
          'Garbage bins not emptied',
          'Collection missed for 2+ days',
          'Bulk waste not picked up',
          'E-waste not collected',
        ],
        defaultCriticality: 'Medium',
      },
      'Bin Area Hygiene': {
        subCategories: [
          'Bins overflowing / spilling',
          'Foul smell from bin area',
          'Bin area not sanitised',
          'Stray animals accessing bins',
        ],
        defaultCriticality: 'Medium',
      },
      'Waste Segregation': {
        subCategories: [
          'Dry/wet waste not separated by staff',
          'Residents not following segregation',
          'No segregation bins provided',
        ],
        defaultCriticality: 'Low',
      },
    },
  },

  'Fire Safety Infrastructure': {
    facilities: {
      'Fire Extinguisher': {
        subCategories: [
          'Extinguisher missing from location',
          'Extinguisher expired / not refilled',
          'Extinguisher seal broken without incident',
        ],
        defaultCriticality: 'Critical',
      },
      'Fire Alarm System': {
        subCategories: [
          'Alarm panel showing fault',
          'Detector not triggered on test',
          'Alarm sounding without cause (false alarm)',
          'Alarm battery dead',
        ],
        defaultCriticality: 'Critical',
      },
      'Sprinkler System': {
        subCategories: [
          'Sprinkler head damaged / missing',
          'Sprinkler pipe leaking',
          'System not pressurised',
        ],
        defaultCriticality: 'Critical',
      },
      'Emergency Exit': {
        subCategories: [
          'Exit blocked by objects',
          'Exit door locked / jammed',
          'Exit signage missing / not lit',
          'Push-bar / panic hardware broken',
        ],
        defaultCriticality: 'Critical',
      },
      'Fire Hydrant / Hose Reel': {
        subCategories: [
          'Hose reel damaged / missing',
          'Hydrant valve stuck',
          'Water pressure insufficient',
        ],
        defaultCriticality: 'Critical',
      },
    },
  },

  'Electrical Infrastructure': {
    facilities: {
      'Common Area Power Outage': {
        subCategories: [
          'Full common area power failure',
          'Partial floor / wing power out',
          'Power fluctuation / low voltage',
        ],
        defaultCriticality: 'High',
      },
      'Generator / DG Set': {
        subCategories: [
          'DG not starting on power cut',
          'DG running but not supplying',
          'DG fuel empty',
          'DG maintenance overdue',
        ],
        defaultCriticality: 'High',
      },
      'Street / Pathway Lighting': {
        subCategories: [
          'Street lights not working at night',
          'Pathway lights out',
          'Lighting timer malfunction',
        ],
        defaultCriticality: 'Medium',
      },
      'Electrical Panel / DB Issue': {
        subCategories: [
          'Distribution board fault',
          'Frequent tripping at panel',
          'Burnt / damaged wiring in panel',
        ],
        defaultCriticality: 'High',
      },
      'Earthing / Safety Issue': {
        subCategories: [
          'Electric shock from surface',
          'Earthing failure reported',
          'Exposed live wire in common area',
        ],
        defaultCriticality: 'Critical',
      },
    },
  },

  'Water & Plumbing Infrastructure': {
    facilities: {
      'Main Pipeline Leakage': {
        subCategories: [
          'Visible water leak in compound',
          'Pipe burst on road / pathway',
          'Underground pipe suspected leak',
        ],
        defaultCriticality: 'High',
      },
      'Sewage / Drainage Overflow': {
        subCategories: [
          'Manhole overflowing',
          'Sewage backing up in common area',
          'Drain blocked causing flooding',
        ],
        defaultCriticality: 'High',
      },
      'Borewell / Pump': {
        subCategories: [
          'Borewell pump not working',
          'Motor failure',
          'Low yield / pressure at source',
        ],
        defaultCriticality: 'High',
      },
      'Water Tank Maintenance': {
        subCategories: [
          'Overhead / sump tank not cleaned on schedule',
          'Tank contamination suspected',
          'Tank level sensor failure',
          'Tank cover missing',
        ],
        defaultCriticality: 'High',
      },
    },
  },

  'Security Services': {
    facilities: {
      'Security Personnel': {
        subCategories: [
          'Guard absent from post',
          'Guard sleeping on duty',
          'Insufficient guards deployed',
          'Guard unresponsive',
        ],
        defaultCriticality: 'High',
      },
      'Security Misconduct': {
        subCategories: [
          'Rude / unprofessional behaviour',
          'Discrimination complaint',
          'Bribery / corruption allegation',
        ],
        defaultCriticality: 'High',
      },
      'Unauthorized Entry / Theft': {
        subCategories: [
          'Unknown person on premises',
          'Vehicle theft / attempted theft',
          'Break-in attempt reported',
          'Theft of common property',
        ],
        defaultCriticality: 'Critical',
      },
    },
  },

  'Roads & Driveways': {
    facilities: {
      'Road Surface Damage': {
        subCategories: [
          'Pothole on internal road',
          'Speed breaker damaged / missing',
          'Road marking faded',
          'Road surface cracked',
        ],
        defaultCriticality: 'Low',
      },
      'Drainage on Road': {
        subCategories: [
          'Road drain blocked',
          'Water logging on internal road',
          'Gutter overflow',
        ],
        defaultCriticality: 'Medium',
      },
      'Road Lighting': {
        subCategories: [
          'Road lamp not working',
          'Area poorly lit at night',
        ],
        defaultCriticality: 'Low',
      },
    },
  },
};

// ─── Lookup helpers ────────────────────────────────────────────────────────────

export function suggestCriticality(
  category: string,
  issueOrFacility: string,
  area?: string,
): Criticality {
  if (category === 'Personal') {
    return PERSONAL_ISSUE_TYPES[issueOrFacility]?.defaultCriticality ?? 'Medium';
  }
  if (category === 'Common' && area) {
    return COMMON_AREAS[area]?.facilities[issueOrFacility]?.defaultCriticality ?? 'Medium';
  }
  return 'Medium';
}

export const PERSONAL_ISSUE_TYPE_LIST = Object.keys(PERSONAL_ISSUE_TYPES);
export const COMMON_AREA_LIST         = Object.keys(COMMON_AREAS);

// ─── Kept for backwards-compat (analytics / SOP pages) ───────────────────────
export const ISSUE_TYPES: Record<string, string[]> = Object.fromEntries([
  ...Object.entries(PERSONAL_ISSUE_TYPES).map(([k, v]) => [k, v.subCategories]),
  ...Object.values(COMMON_AREAS).flatMap(a =>
    Object.entries(a.facilities).map(([k, v]) => [k, v.subCategories])
  ),
]);

export const ISSUE_TYPE_LIST = Object.keys(ISSUE_TYPES);

// ─── Shared UI constants ───────────────────────────────────────────────────────
export const CRITICALITY_OPTIONS = [
  {
    value: 'Critical',
    label: 'Critical',
    description: 'Life safety risk or complete service failure',
    color: 'bg-red-600 text-white',
    border: 'border-red-500',
  },
  {
    value: 'High',
    label: 'High',
    description: 'Significant disruption requiring urgent resolution',
    color: 'bg-orange-500 text-white',
    border: 'border-orange-400',
  },
  {
    value: 'Medium',
    label: 'Medium',
    description: 'Moderate inconvenience; planned resolution acceptable',
    color: 'bg-yellow-500 text-black',
    border: 'border-yellow-400',
  },
  {
    value: 'Low',
    label: 'Low',
    description: 'Minor or cosmetic; no immediate functional impact',
    color: 'bg-green-500 text-white',
    border: 'border-green-400',
  },
] as const;

export const SEVERITY_OPTIONS = [
  { value: 'S1', label: 'S1 – Blocker', description: 'Complete service unavailable; immediate action required' },
  { value: 'S2', label: 'S2 – Major',   description: 'Major degradation; workaround difficult' },
  { value: 'S3', label: 'S3 – Minor',   description: 'Partial impact; workaround available' },
  { value: 'S4', label: 'S4 – Cosmetic',description: 'No functional impact; aesthetic or minor issue' },
] as const;

export const SLA_MATRIX = [
  { criticality: 'Critical', response: '30 minutes',      resolution: '4 hours',          escalation: '2 hours',  color: 'text-red-600',    bgColor: 'bg-red-50' },
  { criticality: 'High',     response: '2 hours',         resolution: '24 hours',         escalation: '12 hours', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { criticality: 'Medium',   response: '8 hours',         resolution: '72 hours (3 days)',escalation: '48 hours', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { criticality: 'Low',      response: '24 hours',        resolution: '7 days',           escalation: '5 days',   color: 'text-green-600',  bgColor: 'bg-green-50' },
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

export const CATEGORY_COLORS: Record<string, string> = {
  Personal: 'bg-indigo-100 text-indigo-800',
  Common:   'bg-teal-100 text-teal-800',
};

export const CHART_COLORS = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#8b5cf6','#ec4899','#14b8a6'];
