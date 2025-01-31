import React, { useEffect, useState } from 'react';
import { AlertCircle, Clock, User, Link as LinkIcon, MessageSquare, GitBranch, CheckCircle2, Code } from 'lucide-react';
import { useIncidentStore } from '../store/incidentStore';
import { TourGuide } from './TourGuide';
import { RecommendationModal } from './RecommendationModal';
import type { Recommendation } from '../types';

const mockLogs = [
  { 
    timestamp: '2024-03-14T10:15:00Z', 
    level: 'error', 
    message: 'Connection timeout in primary database', 
    source: 'Datadog',
    summary: 'Database response time has increased significantly, causing timeouts in user transactions.',
    details: {
      service: 'db-cluster-01',
      env: 'production',
      trace_id: 'dd.trace.12345',
      metrics: {
        latency: '2.5s',
        memory_usage: '85%',
        connection_pool_size: '100',
        active_connections: '95',
        failed_transactions: '23'
      },
      events: [
        { time: '10:14:30Z', message: 'Connection pool near capacity (95%)' },
        { time: '10:14:45Z', message: 'Transaction timeout threshold exceeded' },
        { time: '10:15:00Z', message: 'Multiple transaction failures detected' }
      ]
    }
  },
  { 
    timestamp: '2024-03-14T10:14:55Z', 
    level: 'warn', 
    message: 'High memory usage detected', 
    source: 'Splunk',
    summary: 'API Gateway is experiencing memory pressure due to increased request volume.',
    details: {
      host: 'api-gateway-prod-01',
      component: 'api-gateway',
      correlation_id: 'splk.corr.67890',
      metrics: {
        memory: '2.1GB',
        cpu: '78%',
        request_rate: '1200/sec',
        error_rate: '5%'
      },
      logs: [
        { timestamp: '10:14:30Z', level: 'warn', message: 'Memory usage trending upward' },
        { timestamp: '10:14:45Z', level: 'warn', message: 'GC cycles increasing' },
        { timestamp: '10:14:55Z', level: 'error', message: 'Memory threshold exceeded' }
      ]
    }
  },
  { 
    timestamp: '2024-03-14T10:14:30Z', 
    level: 'info', 
    message: 'Auto-scaling triggered', 
    source: 'kubernetes-cluster',
    summary: 'Kubernetes cluster is automatically scaling up to handle increased load.',
    details: {
      namespace: 'production',
      pod: 'api-gateway-7d8f9',
      reason: 'CPU threshold exceeded',
      cluster_metrics: {
        nodes: {
          total: 5,
          available: 2
        },
        pods: {
          running: 15,
          pending: 3,
          failed: 0
        },
        resources: {
          cpu_utilization: '82%',
          memory_utilization: '75%'
        }
      },
      events: [
        { type: 'Normal', reason: 'ScalingReplicaSet', message: 'Scaled up replica set api-gateway-7d8f9 to 5' },
        { type: 'Normal', reason: 'SuccessfulCreate', message: 'Created pod: api-gateway-7d8f9-xyz89' },
        { type: 'Normal', reason: 'Scheduled', message: 'Successfully assigned pod to node-2' }
      ]
    }
  },
];

const mockIncident = {
  id: '4',
  title: 'Memory Leak in User Service Fixed',
  severity: 'medium',
  status: 'resolved',
  service: 'User Service',
  assignee: 'Sarah Chen',
  createdAt: '2024-03-10T08:00:00Z',
  updatedAt: '2024-03-10T14:30:00Z',
  description: 'Memory leak in user session handling caused by incorrect cleanup of WebSocket connections.',
  resolution: {
    commits: [
      {
        id: 'abc123',
        author: 'Sarah Chen',
        message: 'fix: properly close WebSocket connections on user logout',
        timestamp: '2024-03-10T14:15:00Z',
        diff: {
          filename: 'src/services/websocket.ts',
          before: `export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();

  public async handleUserLogout(userId: string) {
    // Bug: Connection not properly closed
    this.connections.delete(userId);
  }
}`,
          after: `export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();

  public async handleUserLogout(userId: string) {
    // Fix: Properly close WebSocket before removing
    const connection = this.connections.get(userId);
    if (connection) {
      await connection.close(1000, 'User logged out');
      this.connections.delete(userId);
    }
  }
}`
        }
      }
    ],
    rootCause: 'WebSocket connections were being removed from the tracking Map without being properly closed, leading to memory leaks.',
    impact: 'Server memory usage increased by 25% over 48 hours, affecting service performance.',
    resolution: 'Added proper WebSocket cleanup on user logout, reducing memory usage back to normal levels.',
    metrics: {
      timeToResolve: '6.5 hours',
      memoryImprovement: '25%',
      affectedUsers: '1,200'
    }
  }
};

const mockRecommendations = [
  {
    id: '1',
    title: 'Implement WebSocket Connection Manager',
    description: 'Based on the resolved memory leak, consider implementing a centralized WebSocket connection manager with proper lifecycle hooks.',
    confidence: 0.95,
    source: 'Similar Incident Analysis',
  },
  {
    id: '2',
    title: 'Add Connection Monitoring',
    description: 'Set up monitoring for WebSocket connection counts and lifecycle events to detect potential leaks early.',
    confidence: 0.85,
    source: 'Best Practices',
  },
  {
    id: '3',
    title: 'Update WebSocket Documentation',
    description: 'Document the proper connection cleanup patterns identified during this incident for future reference.',
    confidence: 0.80,
    source: 'Knowledge Base Analysis',
  }
];

export function IncidentDetail() {
  const { activeIncident, setActiveIncident, addLog, updateRecommendations } = useIncidentStore();
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [showDiff, setShowDiff] = useState(true);

  useEffect(() => {
    setActiveIncident(mockIncident);
    updateRecommendations(mockRecommendations);
    
    const logInterval = setInterval(() => {
      addLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'System health check completed',
        source: 'health-monitor',
      });
    }, 10000);

    return () => clearInterval(logInterval);
  }, [setActiveIncident, addLog, updateRecommendations]);

  if (!activeIncident) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{activeIncident.title}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                activeIncident.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activeIncident.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Incident #{activeIncident.id} • {activeIncident.service}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <LinkIcon className="mr-2 h-4 w-4" />
              Share
            </button>
            <button className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              <MessageSquare className="mr-2 h-4 w-4" />
              Start Collaboration
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            {activeIncident.resolution && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
                  <Code className="mr-2 h-5 w-5" />
                  Code Changes
                </h2>
                <div className="space-y-4">
                  {activeIncident.resolution.commits.map((commit) => (
                    <div key={commit.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">{commit.message}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          by {commit.author} • {new Date(commit.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {commit.diff && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{commit.diff.filename}</span>
                            <button
                              onClick={() => setShowDiff(!showDiff)}
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                            >
                              {showDiff ? 'Hide Diff' : 'Show Diff'}
                            </button>
                          </div>
                          
                          {showDiff && (
                            <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200">
                              <div className="p-4 bg-red-50">
                                <h4 className="mb-2 text-sm font-medium text-red-800">Before</h4>
                                <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-red-700 h-full">
                                  {commit.diff.before}
                                </pre>
                              </div>
                              <div className="p-4 bg-green-50 border-l border-gray-200">
                                <h4 className="mb-2 text-sm font-medium text-green-800">After</h4>
                                <pre className="overflow-x-auto whitespace-pre-wrap text-sm text-green-700 h-full">
                                  {commit.diff.after}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-white p-6 shadow" data-tour="incident-timeline">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Investigation Timeline</h2>
              <div className="space-y-6">
                {mockLogs.map((log, index) => (
                  <div key={index} className="rounded-lg border border-gray-100 p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 h-2 w-2 rounded-full ${
                        log.level === 'error' ? 'bg-red-500' : 
                        log.level === 'warn' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{log.source}</span>
                            <p className="mt-1 text-sm text-gray-900">{log.summary}</p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <details className="group">
                            <summary className="flex cursor-pointer items-center text-sm text-indigo-600 hover:text-indigo-500">
                              <span className="mr-2">View Technical Details</span>
                              <svg className="h-4 w-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="mt-3 rounded-md bg-gray-50 p-4">
                              {log.source === 'Datadog' && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Service</h4>
                                      <p className="text-sm text-gray-900">{log.details.service}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Environment</h4>
                                      <p className="text-sm text-gray-900">{log.details.env}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500">Metrics</h4>
                                    <div className="mt-1 grid grid-cols-2 gap-2">
                                      {Object.entries(log.details.metrics).map(([key, value]) => (
                                        <div key={key} className="rounded-md bg-white p-2">
                                          <span className="text-xs text-gray-500">{key.replace(/_/g, ' ')}</span>
                                          <p className="text-sm font-medium text-gray-900">{value}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500">Event Timeline</h4>
                                    <div className="mt-1 space-y-2">
                                      {log.details.events.map((event, i) => (
                                        <div key={i} className="flex text-sm">
                                          <span className="text-gray-500">{event.time}</span>
                                          <span className="ml-2 text-gray-900">{event.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {log.source === 'Splunk' && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Host</h4>
                                      <p className="text-sm text-gray-900">{log.details.host}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Component</h4>
                                      <p className="text-sm text-gray-900">{log.details.component}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500">Metrics</h4>
                                    <div className="mt-1 grid grid-cols-2 gap-2">
                                      {Object.entries(log.details.metrics).map(([key, value]) => (
                                        <div key={key} className="rounded-md bg-white p-2">
                                          <span className="text-xs text-gray-500">{key.replace(/_/g, ' ')}</span>
                                          <p className="text-sm font-medium text-gray-900">{value}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500">Log Events</h4>
                                    <div className="mt-1 space-y-2">
                                      {log.details.logs.map((logEvent, i) => (
                                        <div key={i} className="flex items-center text-sm">
                                          <span className="text-gray-500">{logEvent.timestamp}</span>
                                          <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                            logEvent.level === 'error' ? 'bg-red-100 text-red-800' :
                                            logEvent.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                          }`}>
                                            {logEvent.level}
                                          </span>
                                          <span className="ml-2 text-gray-900">{logEvent.message}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {log.source === 'kubernetes-cluster' && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Namespace</h4>
                                      <p className="text-sm text-gray-900">{log.details.namespace}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Pod</h4>
                                      <p className="text-sm text-gray-900">{log.details.pod}</p>
                                    </div>
                                    <div>
                                      <h4 className="text-xs font-medium text-gray-500">Reason</h4>
                                      <p className="text-sm text-gray-900">{log.details.reason}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500">Cluster Metrics</h4>
                                    <div className="mt-2 grid grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <h5 className="text-xs font-medium text-gray-700">Nodes</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                          {Object.entries(log.details.cluster_metrics.nodes).map(([key, value]) => (
                                            <div key={key} className="rounded-md bg-white p-2">
                                              <span className="text-xs text-gray-500">{key}</span>
                                              <p className="text-sm font-medium text-gray-900">{value}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <h5 className="text-xs font-medium text-gray-700">Pods</h5>
                                        <div className="grid grid-cols-2 gap-2">
                                          {Object.entries(log.details.cluster_metrics.pods).map(([key, value]) => (
                                            <div key={key} className="rounded-md bg-white p-2">
                                              <span className="text-xs text-gray-500">{key}</span>
                                              <p className="text-sm font-medium text-gray-900">{value}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <h5 className="text-xs font-medium text-gray-700">Resources</h5>
                                        <div className="grid grid-cols-1 gap-2">
                                          {Object.entries(log.details.cluster_metrics.resources).map(([key, value]) => (
                                            <div key={key} className="rounded-md bg-white p-2">
                                              <span className="text-xs text-gray-500">{key.replace(/_/g, ' ')}</span>
                                              <p className="text-sm font-medium text-gray-900">{value}</p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-medium text-gray-500">Events</h4>
                                    <div className="mt-1 space-y-2">
                                      {log.details.events.map((event, i) => (
                                        <div key={i} className="rounded-md bg-white p-2 text-sm">
                                          <div className="flex items-center">
                                            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                              event.type === 'Normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                              {event.type}
                                            </span>
                                            <span className="ml-2 font-medium text-gray-900">{event.reason}</span>
                                          </div>
                                          <p className="mt-1 text-gray-600">{event.message}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </details>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Impact Analysis</h2>
              {activeIncident.resolution && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Root Cause</h3>
                    <p className="mt-1 text-sm text-gray-500">{activeIncident.resolution.rootCause}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Impact</h3>
                    <p className="mt-1 text-sm text-gray-500">{activeIncident.resolution.impact}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Resolution</h3>
                    <p className="mt-1 text-sm text-gray-500">{activeIncident.resolution.resolution}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-medium text-gray-900">Time to Resolve</h4>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {activeIncident.resolution.metrics.timeToResolve}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-medium text-gray-900">Memory Improvement</h4>
                      <p className="mt-1 text-lg font-semibold text-green-600">
                        {activeIncident.resolution.metrics.memoryImprovement}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="text-sm font-medium text-gray-900">Affected Users</h4>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {activeIncident.resolution.metrics.affectedUsers}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    {activeIncident.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Assignee</span>
                  <div className="flex items-center">
                    <img
                      className="mr-2 h-6 w-6 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt={activeIncident.assignee}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {activeIncident.assignee}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm text-gray-900">
                    {new Date(activeIncident.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow" data-tour="ai-recommendations">
              <h2 className="mb-4 text-lg font-medium text-gray-900">AI Recommendations</h2>
              <div className="space-y-4">
                {mockRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-all hover:border-indigo-300 hover:shadow-md"
                    onClick={() => setSelectedRecommendation(rec)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedRecommendation(rec);
                      }
                    }}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{rec.title}</h3>
                      <span className="text-sm text-gray-500">
                        {(rec.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{rec.description}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      Source: {rec.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRecommendation && (
        <RecommendationModal
          recommendation={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
        />
      )}

      <TourGuide />
    </div>
  );
}