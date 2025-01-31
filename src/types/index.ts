export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  service: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  resolution?: {
    commits: Array<{
      id: string;
      author: string;
      message: string;
      timestamp: string;
      diff?: {
        filename: string;
        before: string;
        after: string;
      };
    }>;
    rootCause: string;
    impact: string;
    resolution: string;
    metrics: {
      timeToResolve: string;
      memoryImprovement: string;
      affectedUsers: string;
    };
  };
}

export interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info';
  message: string;
  source: string;
  details?: Record<string, any>;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  lastUpdated: string;
  tags: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  source: string;
}