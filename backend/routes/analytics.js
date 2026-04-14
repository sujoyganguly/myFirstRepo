const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/analytics/summary
router.get('/summary', (req, res) => {
  const now = new Date().toISOString();

  const total     = db.prepare("SELECT COUNT(*) as c FROM tickets").get().c;
  const open      = db.prepare("SELECT COUNT(*) as c FROM tickets WHERE status = 'Open'").get().c;
  const inProgress= db.prepare("SELECT COUNT(*) as c FROM tickets WHERE status = 'In Progress'").get().c;
  const resolved  = db.prepare("SELECT COUNT(*) as c FROM tickets WHERE status IN ('Resolved','Closed')").get().c;
  const critical  = db.prepare("SELECT COUNT(*) as c FROM tickets WHERE criticality = 'Critical' AND status NOT IN ('Resolved','Closed')").get().c;
  const breached  = db.prepare(
    "SELECT COUNT(*) as c FROM tickets WHERE status NOT IN ('Resolved','Closed') AND sla_resolution_due < ?"
  ).get(now).c;

  // By criticality
  const byCriticality = db.prepare(
    "SELECT criticality, COUNT(*) as count FROM tickets GROUP BY criticality"
  ).all();

  // By issue type
  const byIssueType = db.prepare(
    "SELECT issue_type, COUNT(*) as count FROM tickets GROUP BY issue_type ORDER BY count DESC LIMIT 10"
  ).all();

  // By status
  const byStatus = db.prepare(
    "SELECT status, COUNT(*) as count FROM tickets GROUP BY status"
  ).all();

  // Daily trend (last 14 days)
  const dailyTrend = db.prepare(`
    SELECT date(date_reported) as date, COUNT(*) as count
    FROM tickets
    WHERE date_reported >= date('now', '-14 days')
    GROUP BY date(date_reported)
    ORDER BY date ASC
  `).all();

  // Average resolution time (hours) for resolved tickets
  const avgResolution = db.prepare(`
    SELECT AVG(
      (julianday(resolved_date) - julianday(date_reported)) * 24
    ) as avg_hours
    FROM tickets
    WHERE resolved_date IS NOT NULL
  `).get();

  // SLA compliance rate
  const slaCompliant = db.prepare(`
    SELECT COUNT(*) as c FROM tickets
    WHERE resolved_date IS NOT NULL
    AND resolved_date <= sla_resolution_due
  `).get().c;

  const totalResolved = db.prepare("SELECT COUNT(*) as c FROM tickets WHERE resolved_date IS NOT NULL").get().c;
  const slaComplianceRate = totalResolved > 0 ? Math.round((slaCompliant / totalResolved) * 100) : 100;

  // Top problem areas (unresolved by issue type)
  const problemAreas = db.prepare(`
    SELECT issue_type, COUNT(*) as open_count,
      SUM(CASE WHEN criticality IN ('Critical','High') THEN 1 ELSE 0 END) as high_priority_count
    FROM tickets
    WHERE status NOT IN ('Resolved','Closed')
    GROUP BY issue_type
    ORDER BY high_priority_count DESC, open_count DESC
    LIMIT 5
  `).all();

  res.json({
    summary: { total, open, inProgress, resolved, critical, breached },
    byCriticality,
    byIssueType,
    byStatus,
    dailyTrend,
    avgResolutionHours: avgResolution?.avg_hours ? Math.round(avgResolution.avg_hours * 10) / 10 : 0,
    slaComplianceRate,
    problemAreas,
  });
});

// GET /api/analytics/sla
router.get('/sla', (req, res) => {
  const now = new Date().toISOString();

  const slaByType = db.prepare(`
    SELECT
      criticality,
      COUNT(*) as total,
      SUM(CASE WHEN resolved_date IS NOT NULL AND resolved_date <= sla_resolution_due THEN 1 ELSE 0 END) as met,
      SUM(CASE WHEN status NOT IN ('Resolved','Closed') AND sla_resolution_due < ? THEN 1 ELSE 0 END) as breached,
      AVG(CASE WHEN resolved_date IS NOT NULL
        THEN (julianday(resolved_date) - julianday(date_reported)) * 24
        ELSE NULL END) as avg_resolution_hours
    FROM tickets
    GROUP BY criticality
    ORDER BY CASE criticality WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END
  `).all(now);

  const breachedTickets = db.prepare(`
    SELECT id, ticket_number, reporter_name, apartment_number, issue_type,
           criticality, severity, description, date_reported, sla_resolution_due, status
    FROM tickets
    WHERE status NOT IN ('Resolved','Closed') AND sla_resolution_due < ?
    ORDER BY sla_resolution_due ASC
  `).all(now);

  res.json({ slaByType, breachedTickets });
});

module.exports = router;
