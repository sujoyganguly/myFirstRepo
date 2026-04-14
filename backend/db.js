const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'itsm.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Base schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tickets (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number    TEXT UNIQUE NOT NULL,
    date_reported    TEXT NOT NULL,
    reporter_name    TEXT NOT NULL,
    apartment_number TEXT,
    contact_number   TEXT,
    category         TEXT NOT NULL DEFAULT 'Personal',
    area             TEXT,
    issue_type       TEXT NOT NULL,
    sub_category     TEXT,
    criticality      TEXT NOT NULL,
    severity         TEXT NOT NULL,
    description      TEXT NOT NULL,
    status           TEXT NOT NULL DEFAULT 'Open',
    sla_response_due    TEXT,
    sla_resolution_due  TEXT,
    sla_breached     INTEGER DEFAULT 0,
    resolved_date    TEXT,
    resolved_by      TEXT,
    resolution_notes TEXT,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
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

// Migrate existing DB: add category + area if not present (SQLite doesn't support IF NOT EXISTS on ALTER)
const existingCols = db.prepare("PRAGMA table_info(tickets)").all().map(c => c.name);
if (!existingCols.includes('category')) {
  db.exec("ALTER TABLE tickets ADD COLUMN category TEXT NOT NULL DEFAULT 'Personal'");
}
if (!existingCols.includes('area')) {
  db.exec("ALTER TABLE tickets ADD COLUMN area TEXT");
}

// Seed demo tickets only on a fresh DB
const count = db.prepare('SELECT COUNT(*) as c FROM tickets').get();
if (count.c === 0) {
  const insert = db.prepare(`
    INSERT INTO tickets
      (ticket_number, date_reported, reporter_name, apartment_number, contact_number,
       category, area, issue_type, sub_category, criticality, severity, description,
       status, sla_response_due, sla_resolution_due, resolved_date, resolved_by, resolution_notes)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const now = new Date();
  const ago = (n) => new Date(now - n * 86400000).toISOString();

  // [ticket_number, date, name, flat, phone, category, area, issue_type, sub_cat, crit, sev, desc, status, resp_due, res_due, resolved_date, resolved_by, res_notes]
  const demos = [
    // ── Personal tickets ──────────────────────────────────────────────────────
    ['SN-2024-0001', ago(10), 'Amit Sharma',     'B-204', '9876543210',
     'Personal', null, 'Water Supply', 'No water / very low pressure', 'Critical', 'S1',
     'No water supply since morning. All taps dry. Entire floor affected.',
     'Resolved', ago(10), ago(9.8), ago(9), 'Maintenance Team',
     'Main valve was stuck. Cleared and restored supply within 3 hours.'],

    ['SN-2024-0002', ago(6), 'Meena Iyer',       'A-204', '9321098765',
     'Personal', null, 'Structural & Civil', 'Ceiling / wall seepage or stains', 'Medium', 'S3',
     'Water seepage from ceiling in living room. Stains growing. Probable terrace leakage.',
     'Resolved', ago(6), ago(5), ago(3), 'Civil Contractor',
     'Terrace waterproofing done. Seepage stopped.'],

    ['SN-2024-0003', ago(0.2), 'Sanjay Kumar',   'D-102', '9210987654',
     'Personal', null, 'Gas Supply', 'Gas leakage smell inside flat', 'Critical', 'S1',
     'Strong smell of gas in kitchen. Family evacuated to corridor. Immediate action needed.',
     'In Progress', ago(0.2), ago(0.03), null, null, null],

    ['SN-2024-0004', ago(3), 'Deepa Krishnan',   'C-303', '9543210987',
     'Personal', null, 'Plumbing & Drainage', 'Blocked bathroom / kitchen drain', 'Medium', 'S3',
     'Bathroom drain completely blocked. Water backing up in shower.',
     'Open', ago(3), ago(2), null, null, null],

    ['SN-2024-0005', ago(5), 'Kavitha Sundaram', 'B-301', '9109876543',
     'Personal', null, 'Electricity & Power', 'Frequent MCB / breaker tripping', 'High', 'S2',
     'MCB trips 3-4 times a day disrupting all appliances. Happening since last week.',
     'Open', ago(5), ago(4), null, null, null],

    // ── Common tickets ────────────────────────────────────────────────────────
    ['SN-2024-0006', ago(7), 'Priya Menon',       'A-302', '9123456780',
     'Common', 'Lift / Elevator', 'Lift Not Operational', 'Complete breakdown', 'High', 'S2',
     'Tower A lift not functional since yesterday evening. Senior residents facing severe difficulty.',
     'Resolved', ago(7), ago(6), ago(5), 'AMC Vendor – Otis',
     'Control panel fault replaced. Lift operational.'],

    ['SN-2024-0007', ago(4), 'Rahul Gupta',       'C-101', '9988776655',
     'Common', 'Main Entrance & Gate', 'Security & Access Control', 'Access card / fob not working', 'High', 'S2',
     'Main gate access cards not working for Tower C residents since 2 days. Residents stuck at gate.',
     'In Progress', ago(4), ago(3), null, null, null],

    ['SN-2024-0008', ago(2), 'Sunita Reddy',      'B-405', '9765432100',
     'Common', 'Corridors & Staircases', 'Housekeeping', 'Corridor not swept / mopped', 'Medium', 'S3',
     'Garbage bags left on B Wing 4th floor corridor not emptied for 3 days. Foul smell spreading.',
     'Open', ago(2), ago(1), null, null, null],

    ['SN-2024-0009', ago(1), 'Vikram Nair',       'A-101', '9654321098',
     'Common', 'Electrical Infrastructure', 'Common Area Power Outage', 'Full common area power failure', 'Critical', 'S1',
     'Complete power failure in basement parking and lobby area. Security cameras also down.',
     'In Progress', ago(1), ago(0.8), null, null, null],

    ['SN-2024-0010', ago(3), 'Arjun Patel',       'B-501', '9432109876',
     'Common', 'Basement Parking', 'Fire Safety Equipment', 'Fire extinguisher missing / expired', 'Critical', 'S1',
     'Three fire extinguishers in basement parking P2 level are past expiry. Safety risk.',
     'Open', ago(3), ago(2.9), null, null, null],

    ['SN-2024-0011', ago(5), 'Nisha Pillai',      'D-203', '9876012345',
     'Common', 'Garden & Landscaping', 'Tree & Shrub Trimming', 'Overgrown branches blocking path', 'Low', 'S4',
     'Large tree branches overhanging walkway near Tower D. Blocking path and could fall.',
     'Open', ago(5), ago(-2), null, null, null],

    ['SN-2024-0012', ago(8), 'Ravi Menon',        'C-402', '9765098765',
     'Common', 'Swimming Pool', 'Water Quality', 'Cloudy / green water', 'High', 'S2',
     'Pool water has turned greenish and murky. Algae growth visible. Pool unusable.',
     'Resolved', ago(8), ago(7), ago(6), 'Pool Maintenance Vendor',
     'Shock chlorination done, filter cleaned, pH balanced. Pool reopened.'],
  ];

  const insertMany = db.transaction((rows) => { for (const r of rows) insert.run(...r); });
  insertMany(demos);
}

module.exports = db;
