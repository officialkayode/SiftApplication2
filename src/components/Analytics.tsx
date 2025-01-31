import React from 'react';
import { BarChart2, TrendingDown, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const metrics = [
  {
    name: 'Mean Time to Resolution',
    value: '45m',
    change: '-15%',
    trend: 'down',
    description: 'Average time to resolve incidents',
  },
  {
    name: 'Incident Rate',
    value: '8.5',
    change: '+2.1%',
    trend: 'up',
    description: 'Incidents per day',
  },
  {
    name: 'System Availability',
    value: '99.95%',
    change: '+0.03%',
    trend: 'up',
    description: 'Overall system uptime',
  },
  {
    name: 'First Response Time',
    value: '5m',
    change: '-30%',
    trend: 'down',
    description: 'Time to first response',
  },
];

const topIssues = [
  { name: 'Database Timeouts', count: 15, percentage: 25 },
  { name: 'API Latency', count: 12, percentage: 20 },
  { name: 'Memory Leaks', count: 8, percentage: 13 },
  { name: 'Network Issues', count: 7, percentage: 12 },
  { name: 'Cache Misses', count: 5, percentage: 8 },
];

export function Analytics() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Performance metrics and incident trends
          </p>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.name}
              className="rounded-lg border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                <p className={`ml-2 text-sm ${
                  metric.trend === 'down' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-500">{metric.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Incident Timeline */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
              <BarChart2 className="mr-2 h-5 w-5" />
              Incident Timeline
            </h2>
            <div className="h-64 w-full bg-gray-50">
              {/* Placeholder for timeline chart */}
              <div className="flex h-full items-center justify-center text-gray-400">
                Timeline Visualization
              </div>
            </div>
          </div>

          {/* Top Issues */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
              <AlertCircle className="mr-2 h-5 w-5" />
              Top Issues
            </h2>
            <div className="space-y-4">
              {topIssues.map((issue) => (
                <div key={issue.name} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {issue.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {issue.count} incidents
                      </span>
                    </div>
                    <div className="mt-1 w-full rounded-full bg-gray-200">
                      <div
                        className="rounded-full bg-indigo-600 p-0.5"
                        style={{ width: `${issue.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}