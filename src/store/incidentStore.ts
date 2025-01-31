import { create } from 'zustand';
import type { Incident, LogEntry, Recommendation } from '../types';

interface IncidentState {
  activeIncident: Incident | null;
  relatedIncidents: Incident[];
  logs: LogEntry[];
  recommendations: Recommendation[];
  setActiveIncident: (incident: Incident) => void;
  addLog: (log: LogEntry) => void;
  updateRecommendations: (recommendations: Recommendation[]) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  activeIncident: null,
  relatedIncidents: [],
  logs: [],
  recommendations: [],
  setActiveIncident: (incident) => set({ activeIncident: incident }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  updateRecommendations: (recommendations) => set({ recommendations }),
}));