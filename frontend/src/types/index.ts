export type Criticality = 'Critical' | 'High' | 'Medium' | 'Low';
export type Severity    = 'S1' | 'S2' | 'S3' | 'S4';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Ticket {
  id: number;
  ticket_number: string;
  date_reported: string;
  reporter_name: string;
  apartment_number: string | null;
  contact_number: string | null;
  issue_type: string;
  sub_category: string | null;
  criticality: Criticality;
  severity: Severity;
  description: string;
  status: TicketStatus;
  sla_response_due: string;
  sla_resolution_due: string;
  sla_breached: boolean;
  resolved_date: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TicketUpdate {
  id: number;
  ticket_id: number;
  updated_by: string;
  notes: string;
  old_status: string;
  new_status: string;
  created_at: string;
}

export interface TicketListResponse {
  total: number;
  page: number;
  limit: number;
  tickets: Ticket[];
}

export interface AnalyticsSummary {
  summary: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    critical: number;
    breached: number;
  };
  byCriticality: { criticality: string; count: number }[];
  byIssueType:   { issue_type: string; count: number }[];
  byStatus:      { status: string; count: number }[];
  dailyTrend:    { date: string; count: number }[];
  avgResolutionHours: number;
  slaComplianceRate:  number;
  problemAreas: { issue_type: string; open_count: number; high_priority_count: number }[];
}

export interface SLAReport {
  slaByType: {
    criticality: string;
    total: number;
    met: number;
    breached: number;
    avg_resolution_hours: number | null;
  }[];
  breachedTickets: Ticket[];
}

export interface CreateTicketPayload {
  reporter_name: string;
  apartment_number: string;
  contact_number: string;
  issue_type: string;
  sub_category: string;
  criticality: Criticality;
  severity: Severity;
  description: string;
}
