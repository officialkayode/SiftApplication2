import React, { useState } from 'react';
import { Bell, Shield, Users, Zap, Database, Webhook, Video, FileText, MessageSquare, GitBranch, Code } from 'lucide-react';

const settings = [
  {
    section: 'Source Control',
    icon: GitBranch,
    items: [
      { name: 'GitHub', description: 'Connect repositories for code changes and commit tracking', connected: false },
      { name: 'Bitbucket', description: 'Track code changes and link commits to incidents', connected: false },
      { name: 'GitLab', description: 'Repository integration and merge request tracking', connected: false },
    ],
  },
  {
    section: 'Monitoring & Logging',
    icon: Zap,
    items: [
      { name: 'Datadog', description: 'Connect to Datadog for metrics and APM', connected: true },
      { name: 'Splunk', description: 'Integrate with Splunk for log aggregation', connected: false },
      { name: 'Prometheus', description: 'Monitor system metrics with Prometheus', connected: true },
    ],
  },
  {
    section: 'Communication',
    icon: MessageSquare,
    items: [
      { name: 'Slack', description: 'Real-time alerts and team collaboration', connected: true },
      { name: 'Microsoft Teams', description: 'Team chat and incident updates', connected: false },
      { name: 'Discord', description: 'Developer community and alerts', connected: false },
    ],
  },
  {
    section: 'Meeting & Documentation',
    icon: Video,
    items: [
      { name: 'Zoom', description: 'Automatic meeting summaries and recordings', connected: true },
      { name: 'Google Meet', description: 'Meeting transcripts and action items', connected: false },
      { name: 'Google Docs', description: 'Incident documentation and reports', connected: true },
      { name: 'Notion', description: 'Knowledge base and team wiki', connected: false },
    ],
  },
  {
    section: 'Ticketing & Project Management',
    icon: FileText,
    items: [
      { name: 'Jira', description: 'Issue tracking and project management', connected: true },
      { name: 'ServiceNow', description: 'ITSM and incident management', connected: false },
      { name: 'Linear', description: 'Software project and bug tracking', connected: false },
    ],
  },
  {
    section: 'Security',
    icon: Shield,
    items: [
      { name: 'PagerDuty', description: 'On-call management and escalations', connected: true },
      { name: 'OpsGenie', description: 'Alert management and scheduling', connected: false },
      { name: 'VictorOps', description: 'Incident response and collaboration', connected: false },
    ],
  },
];

interface IntegrationModalProps {
  integration: { name: string; description: string };
  onClose: () => void;
}

function IntegrationModal({ integration, onClose }: IntegrationModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Configure {integration.name}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{integration.description}</p>
                <div className="mt-4">
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                    API Key
                  </label>
                  <input
                    type="password"
                    name="apiKey"
                    id="apiKey"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter your API key"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="webhook" className="block text-sm font-medium text-gray-700">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    name="webhook"
                    id="webhook"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Settings() {
  const [selectedIntegration, setSelectedIntegration] = useState<{ name: string; description: string } | null>(null);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your integrations and preferences
          </p>
        </div>

        <div className="space-y-6">
          {settings.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.section}
                className="rounded-lg border bg-white shadow-sm"
              >
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="flex items-center text-lg font-medium text-gray-900">
                    <Icon className="mr-2 h-5 w-5" />
                    {section.section}
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {section.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <div className="ml-4 flex items-center space-x-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.connected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.connected ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                          onClick={() => setSelectedIntegration(item)}
                          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedIntegration && (
        <IntegrationModal
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
        />
      )}
    </div>
  );
}