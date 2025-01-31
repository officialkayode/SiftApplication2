import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  useFloating,
  useInteractions,
  useClick,
  useDismiss,
  offset,
  shift,
  arrow,
} from '@floating-ui/react';

interface TourStep {
  target: string;
  content: string;
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: Record<string, TourStep[]> = {
  '/': [
    {
      target: '[data-tour="dashboard-overview"]',
      title: 'Dashboard Overview',
      content: 'Monitor active incidents and system health at a glance.',
    },
    {
      target: '[data-tour="incident-list"]',
      title: 'Active Incidents',
      content: 'View and manage ongoing incidents. Click any incident for detailed analysis.',
    },
  ],
  '/incidents': [
    {
      target: '[data-tour="incident-timeline"]',
      title: 'Incident Timeline',
      content: 'Track the progression of the incident and all related events.',
    },
    {
      target: '[data-tour="ai-recommendations"]',
      title: 'AI Recommendations',
      content: 'Get AI-powered suggestions for resolving the incident based on historical data.',
    },
  ],
};

export function TourGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const currentTourSteps = tourSteps[location.pathname] || [];

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), shift(), arrow()],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
  ]);

  useEffect(() => {
    setCurrentStep(0);
    if (currentTourSteps.length > 0) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  if (!isOpen || currentTourSteps.length === 0) return null;

  const currentTourStep = currentTourSteps[currentStep];

  return (
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      {...getFloatingProps()}
      className="z-50 w-80 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{currentTourStep.title}</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 hover:bg-gray-100"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-600">{currentTourStep.content}</p>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (currentStep < currentTourSteps.length - 1) {
              setCurrentStep((prev) => prev + 1);
            } else {
              setIsOpen(false);
            }
          }}
          className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
        >
          {currentStep === currentTourSteps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}