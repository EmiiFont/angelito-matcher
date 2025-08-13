import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Calendar, MapPin, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';

interface Participant {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    hasViewedMatch: boolean;
    match: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string;
    } | null;
}

interface EventDetails {
    event: {
        id: string;
        name: string;
        date: string;
        budget: number;
        location: string;
        endedAt?: string;
        numberOfParticipants: number;
        createdAt: string;
        updatedAt: string;
    };
    participants: Participant[];
    totalMatches: number;
    totalViewed: number;
}

interface EventViewProps {
    eventId: string;
    onBack: () => void;
}

export function EventView({ eventId, onBack }: EventViewProps) {
    const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showMatches, setShowMatches] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/events/${eventId}/details`);
            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }
            
            const data = await response.json();
            setEventDetails(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load event');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading event details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={onBack}
                    className="mb-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
                </button>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                    <button 
                        onClick={fetchEventDetails}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!eventDetails) {
        return (
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={onBack}
                    className="mb-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Events
                </button>
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">Event not found</p>
                </div>
            </div>
        );
    }

    const { event, participants, totalMatches, totalViewed } = eventDetails;

    return (
        <div className="max-w-4xl mx-auto">
            <button 
                onClick={onBack}
                className="mb-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
            </button>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                {/* Event Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{event.name}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Event Date</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(event.date)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{event.location}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">${event.budget}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{event.numberOfParticipants}</p>
                            </div>
                        </div>
                    </div>

                    {event.endedAt && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-green-800 dark:text-green-200 text-sm">
                                <CheckCircle className="h-4 w-4 inline mr-2" />
                                Event ended on {formatDateTime(event.endedAt)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Match Statistics */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Match Overview</h2>
                        <button
                            onClick={() => setShowMatches(!showMatches)}
                            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {showMatches ? (
                                <>
                                    <EyeOff className="h-4 w-4" />
                                    <span>Hide Matches</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4" />
                                    <span>Show Matches</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalMatches}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Matches</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalViewed}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Participants Viewed</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {totalMatches > 0 ? Math.round((totalViewed / totalMatches) * 100) : 0}%
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">View Rate</p>
                        </div>
                    </div>
                </div>

                {/* Participants List */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Participants</h2>
                    
                    <div className="space-y-3">
                        {participants.map((participant) => (
                            <div key={participant.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{participant.name}</h3>
                                            {participant.hasViewedMatch ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Viewed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{participant.email}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{participant.phoneNumber}</p>
                                    </div>
                                    
                                    {showMatches && participant.match && (
                                        <div className="ml-4 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Matched with:</p>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">{participant.match.name}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{participant.match.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}