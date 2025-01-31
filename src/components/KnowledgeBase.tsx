import React from 'react';
import { Search, Tag, Clock, ChevronRight } from 'lucide-react';
import { KnowledgeArticle } from '../types';

const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Common Database Connection Issues',
    summary: 'A comprehensive guide to diagnosing and resolving database connection problems in production.',
    lastUpdated: '2024-03-14T10:00:00Z',
    tags: ['database', 'troubleshooting', 'production'],
  },
  {
    id: '2',
    title: 'API Gateway Performance Optimization',
    summary: 'Best practices for optimizing API Gateway performance and reducing latency.',
    lastUpdated: '2024-03-13T15:30:00Z',
    tags: ['api', 'performance', 'optimization'],
  },
  {
    id: '3',
    title: 'Kubernetes Cluster Scaling Guidelines',
    summary: 'Guidelines for setting up auto-scaling and managing cluster resources effectively.',
    lastUpdated: '2024-03-12T09:15:00Z',
    tags: ['kubernetes', 'scaling', 'infrastructure'],
  },
];

const popularTags = [
  'database',
  'api',
  'kubernetes',
  'performance',
  'security',
  'monitoring',
  'troubleshooting',
  'deployment',
];

export function KnowledgeBase() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="mt-1 text-sm text-gray-500">
            Search and browse through our collection of technical articles and guides
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-6">
              <div className="flex rounded-lg border bg-white shadow-sm">
                <div className="flex flex-1 items-center">
                  <Search className="ml-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full border-0 bg-transparent px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="space-y-4">
              {mockArticles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">
                      {article.title}
                    </h2>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="mb-4 text-sm text-gray-500">{article.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(article.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Popular Tags */}
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center text-lg font-medium text-gray-900">
                <Tag className="mr-2 h-5 w-5" />
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}