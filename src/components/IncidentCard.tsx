import React from 'react';
import { AlertCircle, Clock, User, GitBranch, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Incident } from '../types';

interface IncidentCardProps {
  incident: Incident;
}

const severityColors = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export function IncidentCard({ incident }: IncidentCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/incidents/${incident.id}`);
  };

  return (
    <div 
      className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityColors[incident.severity]}`}>
            {incident.severity.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500">{incident.service}</span>
        </div>
        <span className="flex items-center text-sm text-gray-500">
          <Clock className="mr-1 h-4 w-4" />
          {new Date(incident.createdAt).toLocaleString()}
        </span>
      </div>
      
      <h3 className="mt-2 text-lg font-medium text-gray-900">{incident.title}</h3>
      <p className="mt-1 text-sm text-gray-500">{incident.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {incident.status === 'resolved' ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className={`h-5 w-5 ${incident.status === 'open' ? 'text-red-500' : 'text-yellow-500'}`} />
          )}
          <span className="text-sm font-medium text-gray-900">{incident.status}</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {incident.resolution?.commits && (
            <div className="flex items-center text-sm text-gray-500">
              <GitBranch className="mr-1 h-4 w-4" />
              {incident.resolution.commits.length} commits
            </div>
          )}
          {incident.assignee && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="mr-1 h-4 w-4" />
              {incident.assignee}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}