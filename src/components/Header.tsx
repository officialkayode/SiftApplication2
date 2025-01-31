import React from 'react';
import { Bell, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex flex-1">
          <div className="flex w-full max-w-lg items-center">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents, knowledge base, or team members..."
              className="ml-2 w-full border-0 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="relative rounded-full bg-white p-2 hover:bg-gray-100">
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          
          <div className="ml-4 flex items-center">
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
}