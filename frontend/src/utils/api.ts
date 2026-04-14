import axios from 'axios';
import type { Ticket, TicketListResponse, AnalyticsSummary, SLAReport, CreateTicketPayload } from '../types';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const api = axios.create({ baseURL: BASE });

export const ticketsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get<TicketListResponse>('/tickets', { params }).then(r => r.data),

  get: (id: number) =>
    api.get<{ ticket: Ticket; updates: import('../types').TicketUpdate[] }>(`/tickets/${id}`).then(r => r.data),

  create: (payload: CreateTicketPayload) =>
    api.post<Ticket>('/tickets', payload).then(r => r.data),

  update: (id: number, payload: {
    status?: string;
    notes?: string;
    updated_by?: string;
    resolved_by?: string;
    resolution_notes?: string;
  }) =>
    api.put<{ ticket: Ticket; updates: import('../types').TicketUpdate[] }>(`/tickets/${id}`, payload).then(r => r.data),
};

export const analyticsApi = {
  summary: () =>
    api.get<AnalyticsSummary>('/analytics/summary').then(r => r.data),

  sla: () =>
    api.get<SLAReport>('/analytics/sla').then(r => r.data),
};
