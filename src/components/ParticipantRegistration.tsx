import { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, Loader2, CheckCircle, XCircle, User } from 'lucide-react';

interface RegistrationDetails {
    eventName: string;
    organizerName: string;
    notificationChannels: string[];
    linkId: string;
}

interface ParticipantRegistrationProps {
    linkId: string;
    onBack: () => void;
}

export function ParticipantRegistration({ linkId, onBack }: ParticipantRegistrationProps) {
    const [registrationDetails, setRegistrationDetails] = useState<RegistrationDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const requiresPhone = registrationDetails?.notificationChannels.includes('sms') || registrationDetails?.notificationChannels.includes('whatsapp');
    const requiresEmail = registrationDetails?.notificationChannels.includes('email');

    useEffect(() => {
        const fetchRegistrationDetails = async () => {
            try {
                const response = await fetch(`/api/register/${linkId}`);
                if (!response.ok) {
                    throw new Error('Invalid or expired registration link');
                }
                const data = await response.json();
                setRegistrationDetails(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to load registration details');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrationDetails();
    }, [linkId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            setError('Name is required');
            return;
        }
        
        if (requiresEmail && !formData.email.trim()) {
            setError('Email is required');
            return;
        }
        
        if (requiresPhone && !formData.phone.trim()) {
            setError('Phone number is required for this event');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/register/${linkId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim() || undefined
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to register');
            }

            setSuccess(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to register. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    <span className="text-gray-600 dark:text-gray-300">Loading registration details...</span>
                </div>
            </div>
        );
    }

    if (error && !registrationDetails) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Unavailable</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                    <button
                        onClick={onBack}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Complete!</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                        Thank you for registering for <strong>{registrationDetails?.eventName}</strong>.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        You'll receive your Secret Santa match information via the selected notification methods once the organizer generates the matches.
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Join the Secret Santa!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-1">
                            <strong>{registrationDetails?.organizerName}</strong> is inviting you to the
                        </p>
                        <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                            {registrationDetails?.eventName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Please fill up your information here
                        </p>
                    </div>

                    {/* Notification methods display */}
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            You'll receive notifications via:
                        </p>
                        <div className="flex items-center space-x-4">
                            {registrationDetails?.notificationChannels.map((channel) => (
                                <div key={channel} className="flex items-center">
                                    {channel === 'email' && <Mail className="h-4 w-4 text-gray-500 mr-1" />}
                                    {channel === 'sms' && <MessageSquare className="h-4 w-4 text-gray-500 mr-1" />}
                                    {channel === 'whatsapp' && <Phone className="h-4 w-4 text-gray-500 mr-1" />}
                                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                        {channel === 'whatsapp' ? 'WhatsApp' : channel.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                            />
                        </div>

                        {requiresEmail && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                />
                            </div>
                        )}

                        {requiresPhone && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter your phone number"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                />
                            </div>
                        )}

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Registering...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}