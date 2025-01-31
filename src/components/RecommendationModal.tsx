import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Recommendation } from '../types';

interface RecommendationModalProps {
  recommendation: Recommendation;
  onClose: () => void;
}

export function RecommendationModal({ recommendation, onClose }: RecommendationModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div>
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {recommendation.title}
              </h3>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Confidence Score</span>
                  <span className="flex items-center text-sm">
                    {recommendation.confidence >= 0.7 ? (
                      <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="mr-1 h-4 w-4 text-yellow-500" />
                    )}
                    {(recommendation.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Description</h4>
                  <p className="mt-1 text-sm text-gray-500">{recommendation.description}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Source</h4>
                  <p className="mt-1 text-sm text-gray-500">{recommendation.source}</p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Steps to Implement</h4>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-start">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        1
                      </div>
                      <p className="ml-3 text-sm text-gray-500">
                        Review the current system metrics and logs
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        2
                      </div>
                      <p className="ml-3 text-sm text-gray-500">
                        Apply the suggested configuration changes
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        3
                      </div>
                      <p className="ml-3 text-sm text-gray-500">
                        Monitor the system for improvements
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Similar Past Incidents</h4>
                  <div className="mt-2 space-y-2">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">INC-2024-001</span>
                        <span className="text-xs text-gray-500">Resolved in 45m</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Similar memory usage spike resolved by scaling the service</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6">
            <button
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}