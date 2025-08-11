import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Calendar,
  Gift,
  Eye,
  Edit,
  Download,
  Plus
} from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  numberOfParticipants: number;
  budget: number;
  location: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
  status?: 'active' | 'completed' | 'draft' | 'cancelled';
}

// Mock data for events
const mockEvents: any[] = [
  {
    id: '1',
    name: 'Christmas 2024 Gift Exchange',
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2024-12-25',
    participants: 15,
    budget: 50,
    matches: 15,
    notificationsSent: 15,
    createdAt: '2024-11-15',
    date: '2024-12-01',
    numberOfParticipants: 15,
    location: 'Office'
  },
  {
    id: '2',
    name: 'Office Holiday Party',
    status: 'completed',
    startDate: '2024-11-20',
    endDate: '2024-12-20',
    participants: 25,
    budget: 30,
    matches: 25,
    notificationsSent: 25,
    createdAt: '2024-11-01',
    date: '2024-11-20',
    numberOfParticipants: 25,
    location: 'Conference Room'
  },
  {
    id: '3',
    name: 'Family Secret Santa',
    status: 'draft',
    startDate: '2024-12-15',
    endDate: '2024-12-24',
    participants: 8,
    budget: 75,
    matches: 0,
    notificationsSent: 0,
    createdAt: '2024-11-28',
    date: '2024-12-15',
    numberOfParticipants: 8,
    location: 'Home'
  }
];

interface EventsTableProps {
  onCreateEvent: () => void;
}

export function EventsTable({ onCreateEvent }: EventsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvents(mockEvents as Event[]);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events');
        setEvents(mockEvents as Event[]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getStatusBadge = (status: Event['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    };

    const labels = {
      active: 'Active',
      completed: 'Completed',
      draft: 'Draft',
      cancelled: 'Cancelled'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status || 'draft']}`}>
        {labels[status || 'draft']}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your gift exchange events
          </p>
        </div>
        <button
          onClick={onCreateEvent}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Gift className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {events.filter(e => e.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Participants</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {events.reduce((sum, event) => sum + event.numberOfParticipants, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Gift className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {events.filter(e => e.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            />
          </div>
          <button className="shrink-0 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="shrink-0 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Event Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Location
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Participants
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Budget
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Created
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors dark:bg-gray-800/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <Gift className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {event.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatDate(event.date)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {event.location}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900 dark:text-white">{event.numberOfParticipants}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900 dark:text-white">
                      ${event.budget}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(event.createdAt)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                      <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No events found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm ? 'Try adjusting your search term' : 'Get started by creating your first event'}
          </p>
          <button 
            onClick={onCreateEvent}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </button>
        </div>
      )}
    </div>
  );
}