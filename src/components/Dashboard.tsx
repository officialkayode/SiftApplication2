import React, { useEffect } from 'react';
import { BarChart2, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { IncidentCard } from './IncidentCard';
import { useIncidentStore } from '../store/incidentStore';
import { TourGuide } from './TourGuide';
import { useNavigate } from 'react-router-dom';

const mockIncidents = [
  {
    id: '1',
    title: 'API Gateway High Latency',
    severity: 'critical',
    status: 'open',
    service: 'API Gateway',
    assignee: 'John Doe',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Multiple users reporting increased latency in API responses. Average response time > 2s.',
  },
  {
    id: '2',
    title: 'Database Connection Timeouts',
    severity: 'high',
    status: 'investigating',
    service: 'Database',
    assignee: 'Jane Smith',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'Intermittent connection timeouts observed in the primary database cluster.',
  },
  {
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
            before: `
export class WebSocketManager {
  private connections: Map<string, WebSocket> = new Map();

  public async handleUserLogout(userId: string) {
    // Bug: Connection not properly closed
    this.connections.delete(userId);
  }
}`,
            after: `
export class WebSocketManager {
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
  }
] as const;

const stats = [
  { 
    name: 'Active Incidents', 
    value: '12', 
    icon: AlertCircle, 
    change: '+2', 
    changeType: 'increase',
    route: '/incidents?status=active'
  },
  { 
    name: 'Avg. Resolution Time', 
    value: '45m', 
    icon: Clock, 
    change: '-10%', 
    changeType: 'decrease',
    route: '/analytics#resolution-time'
  },
  { 
    name: 'System Health', 
    value: '98%', 
    icon: TrendingUp, 
    change: '+1%', 
    changeType: 'increase',
    route: '/analytics#system-health'
  },
  { 
    name: 'Open Alerts', 
    value: '24', 
    icon: BarChart2, 
    change: '-3', 
    changeType: 'decrease',
    route: '/incidents?type=alert'
  },
];

export function Dashboard() {
  const { setActiveIncident } = useIncidentStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate receiving a new incident
    const timer = setTimeout(() => {
      const newIncident = {
        id: '3',
        title: 'Memory Usage Alert',
        severity: 'high',
        status: 'open',
        service: 'User Service',
        assignee: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: 'High memory usage detected in User Service pods.',
      };
      setActiveIncident(newIncident);
    }, 5000);

    return () => clearTimeout(timer);
  }, [setActiveIncident]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="mb-8" data-tour="dashboard-overview">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of system health and active incidents
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-all hover:bg-gray-50"
              onClick={() => navigate(stat.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(stat.route);
                }
              }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">{stat.name}</h3>
                  <div className="mt-1 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className={`ml-2 text-sm ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8" data-tour="incident-list">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Incidents</h2>
          <button
            onClick={() => navigate('/incidents')}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {mockIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>

      <TourGuide />
    </div>
  );
}