import { useState } from "react";
import { Sidebar, DashboardView } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { EventsTable } from '@/components/dashboard/EventsTable';
import { CreateEvent } from '@/components/dashboard/CreateEvent';

interface DashboardProps {
    onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState<DashboardView | 'create-event'>('events');

    const handleCreateEvent = () => {
        setActiveView('create-event');
    };

    const handleEventCreated = () => {
        setActiveView('events');
    }

    const renderActiveView = () => {
        switch (activeView) {
            case 'events':
                return <EventsTable onCreateEvent={handleCreateEvent} />;
            case 'create-event':
                return <CreateEvent onEventCreated={handleEventCreated} />;
            default:
                return <EventsTable onCreateEvent={handleCreateEvent} />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={onLogout}
                activeView={activeView as DashboardView}
                onViewChange={(view) => setActiveView(view)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} onLogout={onLogout} />
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderActiveView()}
                </main>
            </div>
        </div>
    );
}

