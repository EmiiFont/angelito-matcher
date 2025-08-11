import { useState } from 'react';
import { Header } from './dashboard/Header';
import { Sidebar, type DashboardView } from './dashboard/Sidebar';
import { EventsTable } from './dashboard/EventsTable';
import { CreateEvent } from './dashboard/CreateEvent';

interface DashboardProps {
  onSignOut: () => void;
  onBackToLanding: () => void;
}

export function Dashboard({ onSignOut, onBackToLanding }: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<DashboardView | 'create-event'>('events');

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
  };

  const handleCreateEvent = () => {
    setActiveView('create-event');
  };

  const handleEventCreated = () => {
    setActiveView('events');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Recent Events</h3>
                <p className="text-gray-600 dark:text-gray-400">View your latest gift exchanges</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h3>
                <p className="text-gray-600 dark:text-gray-400">Create new events and manage participants</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">Track your event performance</p>
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="p-6">
            <EventsTable onCreateEvent={handleCreateEvent} />
          </div>
        );
      case 'create-event':
        return (
          <div className="p-6">
            <CreateEvent onEventCreated={handleEventCreated} />
          </div>
        );
      case 'participants':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Participants</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">Manage your event participants</p>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Calendar</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">View your upcoming events</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Analytics</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">View event analytics and insights</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Settings</h1>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">Manage your account settings</p>
              <button
                onClick={onBackToLanding}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                ← Back to Landing Page
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <EventsTable onCreateEvent={handleCreateEvent} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onSignOut}
        activeView={activeView}
        onViewChange={handleViewChange}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onLogout={onSignOut}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}