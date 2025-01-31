import React, { useState } from 'react';
import { useIncidentStore } from '../store/incidentStore';
import { IncidentCard } from './IncidentCard';
import { Filter, User, AlertCircle } from 'lucide-react';

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
    id: '3',
    title: 'Memory Usage Alert',
    severity: 'medium',
    status: 'investigating',
    service: 'User Service',
    assignee: 'Mike Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'High memory usage detected in User Service pods.',
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
  }
];

const engineers = ['All Engineers', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Chen'];
const statuses = ['All Statuses', 'open', 'investigating', 'resolved'] as const;
const services = ['All Services', 'API Gateway', 'Database', 'User Service'];

export function Incidents() {
  const { setActiveIncident } = useIncidentStore();
  const [selectedStatus, setSelectedStatus] = useState<typeof statuses[number] | 'All Statuses'>('All Statuses');
  const [selectedEngineer, setSelectedEngineer] = useState('All Engineers');
  const [selectedService, setSelectedService] = useState('All Services');

  const filteredIncidents = mockIncidents.filter((incident) => {
    const statusMatch = selectedStatus === 'All Statuses' || incident.status === selectedStatus;
    const engineerMatch = selectedEngineer === 'All Engineers' || incident.assignee === selectedEngineer;
    const serviceMatch = selectedService === 'All Services' || incident.service === selectedService;
    return statusMatch && engineerMatch && serviceMatch;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage all incidents
        </p>
      </div>

      <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <h2 className="text-sm font-medium text-gray-700">Filters</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as typeof statuses[number] | 'All Statuses')}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="engineer" className="block text-sm font-medium text-gray-700">
              Assigned Engineer
            </label>
            <select
              id="engineer"
              value={selectedEngineer}
              onChange={(e) => setSelectedEngineer(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {engineers.map((engineer) => (
                <option key={engineer} value={engineer}>
                  {engineer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
              Service
            </label>
            <select
              id="service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
}