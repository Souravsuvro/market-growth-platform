import { ApiEnvelope, Forecast, InvestorThesis, PitchDeck, Proposal, Recommendation, Report, ResearchRun, ResearchScope } from '../types/intelligence';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  const payload: ApiEnvelope<T> = await response.json();
  return payload.data;
}

export const intelligenceService = {
  createResearchRun(projectId: string, scope: ResearchScope) {
    return request<ResearchRun>('/research-runs', { method: 'POST', body: JSON.stringify({ projectId, scope }) });
  },
  getResearchRun(runId: string) {
    return request<ResearchRun>(`/research-runs/${runId}`);
  },
  listRecommendations(projectId: string) {
    return request<Recommendation[]>(`/projects/${projectId}/recommendations`);
  },
  createForecast(projectId: string, input: { metric: string; horizon: string; scenario: 'bear' | 'base' | 'bull'; assumptions: string[] }) {
    return request<Forecast>('/forecasts', { method: 'POST', body: JSON.stringify({ projectId, ...input }) });
  },
  getInvestorThesis(companyId: string) {
    return request<InvestorThesis>(`/companies/${companyId}/investor-thesis`);
  },
  createReport(input: { projectId: string; researchRunId: string; title: string; template: string }) {
    return request<Report>('/reports', { method: 'POST', body: JSON.stringify(input) });
  },
  createPitchDeck(input: { projectId: string; researchRunId: string; title: string; fundingAsk?: string }) {
    return request<PitchDeck>('/pitch-decks', { method: 'POST', body: JSON.stringify(input) });
  },
  createProposal(input: { pitchDeckId: string; recipientName: string; recipientEmail?: string; message: string }) {
    return request<Proposal>('/proposals', { method: 'POST', body: JSON.stringify(input) });
  },
  createShareLink(resource: 'report' | 'pitch-deck', id: string, expiresAt?: string) {
    return request<{ url: string; expiresAt?: string }>(`/${resource}s/${id}/share`, { method: 'POST', body: JSON.stringify({ expiresAt }) });
  },
};
