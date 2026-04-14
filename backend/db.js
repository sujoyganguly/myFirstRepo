const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'itsm.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number   TEXT UNIQUE NOT NULL,
    date_reported   TEXT NOT NULL,
    reporter_name   TEXT NOT NULL,
    apartment_number TEXT,
    contact_number  TEXT,
    issue_type      TEXT NOT NULL,
    sub_category    TEXT,
    criticality     TEXT NOT NULL,
    severity        TEXT NOT NULL,
    description     TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'Open',
    sla_response_due TEXT,
    sla_resolution_due TEXT,
    sla_breached    INTEGER DEFAULT 0,
    resolved_date   TEXT,
    resolved_by     TEXT,
    resolution_notes TEXT,
    created_at      TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ticket_updates (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_id  INTEGER NOT NULL,
    updated_by TEXT NOT NULL,
    notes      TEXT NOT NULL,
    old_status TEXT,
    new_status TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed demo tickets if table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM tickets').get();
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO tickets
      (ticket_number, date_reported, reporter_name, apartment_number, contact_number,
       issue_type, sub_category, criticality, severity, description, status,
       sla_response_due, sla_resolution_due, resolved_date, resolved_by, resolution_notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const now = new Date();
  const daysAgo = (n) => new Date(now - n * 86400000).toISOString();

  const demos = [
    ['SN-2024-0001', daysAgo(10), 'Amit Sharma', 'B-204', '9876543210',
     'Water Supply', 'No water / low pressure', 'Critical', 'S1',
     'No water supply since morning. All taps dry. Entire floor affected.',
     'Resolved', daysAgo(10), daysAgo(9.8), daysAgo(9), 'Maintenance Team',
     'Main valve was stuck. Cleared and restored supply within 3 hours.'],
    ['SN-2024-0002', daysAgo(7), 'Priya Menon', 'A-302', '9123456780',
     'Lift / Elevator', 'Not working', 'High', 'S2',
     'Tower A lift not functional since yesterday evening. Senior residents facing severe difficulty.',
     'Resolved', daysAgo(7), daysAgo(6), daysAgo(5), 'AMC Vendor - Otis',
     'Control panel fault replaced. Lift operational.'],
    ['SN-2024-0003', daysAgo(4), 'Rahul Gupta', 'C-101', '9988776655',
     'Security & Access', 'Gate access issue', 'High', 'S2',
     'Main gate access card not working for Tower C residents since 2 days. Residents stuck.',
     'In Progress', daysAgo(4), daysAgo(3), null, null, null],
    ['SN-2024-0004', daysAgo(2), 'Sunita Reddy', 'B-405', '9765432100',
     'Housekeeping & Cleanliness', 'Garbage not collected', 'Medium', 'S3',
     'Garbage bins on B Wing corridor not emptied for 3 days. Foul smell spreading.',
     'Open', daysAgo(2), daysAgo(1), null, null, null],
    ['SN-2024-0005', daysAgo(1), 'Vikram Nair', 'A-101', '9654321098',
     'Electricity & Power', 'Power outage in common area', 'Critical', 'S1',
     'Complete power failure in basement parking and lobby area. Security cameras also down.',
     'In Progress', daysAgo(1), daysAgo(0.8), null, null, null],
    ['SN-2024-0006', daysAgo(0.5), 'Deepa Krishnan', 'C-303', '9543210987',
     'Plumbing & Drainage', 'Blocked drain', 'Medium', 'S3',
     'Corridor drainage blocked near C-303. Water logging during rains.',
     'Open', daysAgo(0.5), daysAgo(-0.17), null, null, null],
    ['SN-2024-0007', daysAgo(3), 'Arjun Patel', 'B-501', '9432109876',
     'Pest Control', 'Rodents/Rats', 'High', 'S2',
     'Rats spotted in basement parking and bin area. Urgent pest control needed.',
     'Open', daysAgo(3), daysAgo(2), null, null, null],
    ['SN-2024-0008', daysAgo(6), 'Meena Iyer', 'A-204', '9321098765',
     'Structural & Civil', 'Ceiling seepage', 'Medium', 'S3',
     'Water seepage from ceiling in living room. Stains growing. Probable terrace leakage.',
     'Resolved', daysAgo(6), daysAgo(5), daysAgo(3), 'Civil Contractor',
     'Terrace waterproofing done. Seepage stopped.'],
    ['SN-2024-0009', daysAgo(0.2), 'Sanjay Kumar', 'D-102', '9210987654',
     'Gas Supply', 'Gas leakage smell', 'Critical', 'S1',
     'Strong smell of gas on D Wing ground floor. All residents evacuated. Immediate action needed.',
     'In Progress', daysAgo(0.2), daysAgo(0.03), null, null, null],
    ['SN-2024-0010', daysAgo(5), 'Kavitha Sundaram', 'B-301', '9109876543',
     'Gym & Amenities', 'Gym equipment broken', 'Low', 'S4',
     'Treadmill in gym not functioning. Motor making grinding noise.',
     'Open', daysAgo(5), daysAgo(-2), null, null, null],
  ];

  const insertMany = db.transaction((rows) => {
    for (const r of rows) insert.run(...r);
  });
  insertMany(demos);
}

module.exports = db;
