const express = require('express');
const router  = express.Router();
const db      = require('../db');

const SLA = {
  Critical: { response: 0.5, resolution: 4   },
  High:     { response: 2,   resolution: 24  },
  Medium:   { response: 8,   resolution: 72  },
  Low:      { response: 24,  resolution: 168 },
};

function addHours(dateStr, hours) {
  const d = new Date(dateStr);
  d.setTime(d.getTime() + hours * 3600000);
  return d.toISOString();
}

function generateTicketNumber() {
  const year = new Date().getFullYear();
  const last = db.prepare("SELECT ticket_number FROM tickets ORDER BY id DESC LIMIT 1").get();
  let seq = 1;
  if (last) {
    const parts = last.ticket_number.split('-');
    seq = parseInt(parts[parts.length - 1], 10) + 1;
  }
  return `SN-${year}-${String(seq).padStart(4, '0')}`;
}

// GET /api/tickets
router.get('/', (req, res) => {
  const { status, criticality, issue_type, category, area, search, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const conditions = [];
  const params = [];

  if (status)      { conditions.push('status = ?');      params.push(status); }
  if (criticality) { conditions.push('criticality = ?'); params.push(criticality); }
  if (category)    { conditions.push('category = ?');    params.push(category); }
  if (area)        { conditions.push('area = ?');        params.push(area); }
  if (issue_type)  { conditions.push('issue_type = ?');  params.push(issue_type); }
  if (search) {
    conditions.push('(reporter_name LIKE ? OR description LIKE ? OR ticket_number LIKE ? OR apartment_number LIKE ? OR area LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s, s, s);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const total = db.prepare(`SELECT COUNT(*) as c FROM tickets ${where}`).get(...params).c;
  const rows  = db.prepare(`SELECT * FROM tickets ${where} ORDER BY id DESC LIMIT ? OFFSET ?`)
                  .all(...params, Number(limit), Number(offset));

  const now = new Date().toISOString();
  rows.forEach(r => {
    r.sla_breached = r.status !== 'Resolved' && r.status !== 'Closed' && r.sla_resolution_due < now;
  });

  res.json({ total, page: Number(page), limit: Number(limit), tickets: rows });
});

// GET /api/tickets/:id
router.get('/:id', (req, res) => {
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Not found' });

  const updates = db.prepare(
    'SELECT * FROM ticket_updates WHERE ticket_id = ? ORDER BY created_at ASC'
  ).all(ticket.id);

  const now = new Date().toISOString();
  ticket.sla_breached = ticket.status !== 'Resolved' && ticket.status !== 'Closed'
    && ticket.sla_resolution_due < now;

  res.json({ ticket, updates });
});

// POST /api/tickets
router.post('/', (req, res) => {
  const {
    reporter_name, apartment_number, contact_number,
    category, area,
    issue_type, sub_category, criticality, severity, description,
  } = req.body;

  if (!reporter_name || !category || !issue_type || !criticality || !severity || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (category === 'Common' && !area) {
    return res.status(400).json({ error: 'Area is required for Common tickets' });
  }

  const sla = SLA[criticality] || SLA.Low;
  const now = new Date().toISOString();
  const ticket_number = generateTicketNumber();

  const info = db.prepare(`
    INSERT INTO tickets
      (ticket_number, date_reported, reporter_name, apartment_number, contact_number,
       category, area, issue_type, sub_category, criticality, severity, description,
       status, sla_response_due, sla_resolution_due)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,'Open',?,?)
  `).run(
    ticket_number, now, reporter_name,
    apartment_number || null, contact_number || null,
    category, area || null, issue_type, sub_category || null,
    criticality, severity, description,
    addHours(now, sla.response), addHours(now, sla.resolution)
  );

  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(ticket);
});

// PUT /api/tickets/:id
router.put('/:id', (req, res) => {
  const { status, notes, updated_by, resolved_by, resolution_notes } = req.body;
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Not found' });

  const old_status = ticket.status;
  const now = new Date().toISOString();
  const resolved_date = (status === 'Resolved' || status === 'Closed') ? now : ticket.resolved_date;

  db.prepare(`
    UPDATE tickets SET
      status = ?, resolved_date = ?, resolved_by = ?,
      resolution_notes = ?, updated_at = ?
    WHERE id = ?
  `).run(
    status || ticket.status, resolved_date,
    resolved_by || ticket.resolved_by,
    resolution_notes || ticket.resolution_notes,
    now, ticket.id
  );

  if (notes) {
    db.prepare(`
      INSERT INTO ticket_updates (ticket_id, updated_by, notes, old_status, new_status)
      VALUES (?,?,?,?,?)
    `).run(ticket.id, updated_by || 'System', notes, old_status, status || old_status);
  }

  const updated = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticket.id);
  const updates = db.prepare(
    'SELECT * FROM ticket_updates WHERE ticket_id = ? ORDER BY created_at ASC'
  ).all(ticket.id);

  res.json({ ticket: updated, updates });
});

module.exports = router;
