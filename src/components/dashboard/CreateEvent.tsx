import { useState, useEffect } from "react";
import { JoinedParticipants } from './JoinedParticipants';
import { RestrictionsModal } from './RestrictionsModal';
import { useSession, getSession } from '../../lib/auth-client';
import {
    Mail,
    Settings,
    Plus,
    MessageSquare,
    Trash2,
    Link,
    Copy,
    CheckCircle,
    Lightbulb,
    Loader2,
    X,
    ArrowLeft,
    ArrowRight,
    Phone
} from "lucide-react";


type NotificationChannel = "email" | "sms" | "whatsapp";

interface Person {
    name: string;
    email: string;
    phone?: string;
}

interface CreateEventProps {
    onEventCreated: () => void;
}

export function CreateEvent({ onEventCreated }: CreateEventProps) {
    const { data: session } = useSession();
    const [step, setStep] = useState(1);
    const [eventName, setEventName] = useState("");
    const [persons, setPersons] = useState<Person[]>([{ name: "", email: "" }]);
    const [restrictions, setRestrictions] = useState<Record<number, number[]>>({});
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [notificationChannels, setNotificationChannels] = useState<NotificationChannel[]>(["email"]);
    const [showTipBanner, setShowTipBanner] = useState(true);

    // Helper functions for notification channels
    const toggleNotificationChannel = (channel: NotificationChannel) => {
        setNotificationChannels(prev => {
            if (prev.includes(channel)) {
                // Don't allow removing all channels
                if (prev.length === 1) return prev;
                return prev.filter(c => c !== channel);
            } else {
                return [...prev, channel];
            }
        });
    };

    const requiresPhoneNumber = notificationChannels.includes("sms") || notificationChannels.includes("whatsapp");
    const requiresEmail = notificationChannels.includes("email");
    const [participantLink, setParticipantLink] = useState<string | null>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [joinedParticipants, setJoinedParticipants] = useState<Person[]>([]);
    const [selectedParticipantEmails, setSelectedParticipantEmails] = useState<string[]>([]);
    const [restrictionsModalOpen, setRestrictionsModalOpen] = useState(false);
    const [selectedParticipantIndex, setSelectedParticipantIndex] = useState<number>(0);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // Store all participants from API (before filtering)
    const [allParticipants, setAllParticipants] = useState<(Person & { alreadyAdded?: boolean })[]>([]);

    // Update joined participants whenever selected emails change
    useEffect(() => {
        if (allParticipants.length > 0) {
            const filteredParticipants = allParticipants.filter((p) => 
                !p.alreadyAdded && !selectedParticipantEmails.includes(p.email)
            );
            setJoinedParticipants(filteredParticipants);
        }
    }, [selectedParticipantEmails, allParticipants]);

    // Cleanup polling on component unmount
    useEffect(() => {
        return () => {
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        };
    }, [pollingInterval]);

    const startPollingForParticipants = (linkId: string) => {
        // Clear any existing interval
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }

        const interval = setInterval(async () => {
            try {
                const response = await fetch(`/api/events/participants/${linkId}`);
                if (response.ok) {
                    const participants = await response.json();
                    setAllParticipants(participants || []);
                }
            } catch (error) {
                console.error('Error polling for participants:', error);
            }
        }, 3000); // Poll every 3 seconds

        setPollingInterval(interval);
    };

    const handleNext = () => {
        if (step === 1) {
            if (!eventName.trim()) {
                alert("Please enter an event name.");
                return;
            }
            if (parseFloat(amount) <= 0 || !amount) {
                alert("Please enter a positive budget amount.");
                return;
            }
            if (!location.trim()) {
                alert("Please enter an event location.");
                return;
            }
        }
        if (step === 2) {
            if (persons.length < 2) {
                alert("Please add at least two participants.");
                return;
            }
            for (const person of persons) {
                if (!person.name.trim()) {
                    alert("Please fill in the name for all participants.");
                    return;
                }
                if (requiresEmail && !person.email.trim()) {
                    alert("Please fill in the email address for all participants.");
                    return;
                }
                if (requiresPhoneNumber && !person.phone?.trim()) {
                    alert("Please fill in the phone number for all participants when SMS or WhatsApp is selected.");
                    return;
                }
            }
        }
        nextStep();
    };

    const addPerson = () => {
        if (persons.length < 50) {
            setPersons([...persons, { name: "", email: "" }]);
        }
    };

    const removePerson = (index: number) => {
        if (persons.length <= 1) return;

        const newPersons = persons.filter((_, idx) => idx !== index);
        setPersons(newPersons);

        const updatedRestrictions: Record<number, number[]> = {};
        Object.keys(restrictions).forEach((key) => {
            const personIndex = parseInt(key);
            if (personIndex !== index) {
                const newIndex = personIndex > index ? personIndex - 1 : personIndex;
                const adjustedRestrictions = restrictions[personIndex]
                    .filter(restrictedIndex => restrictedIndex !== index)
                    .map(restrictedIndex => restrictedIndex > index ? restrictedIndex - 1 : restrictedIndex);
                updatedRestrictions[newIndex] = adjustedRestrictions;
            }
        });
        setRestrictions(updatedRestrictions);
    };

    const updatePerson = (
        index: number,
        field: "name" | "email" | "phone",
        value: string,
    ) => {
        const newPersons = [...persons];
        newPersons[index] = { ...newPersons[index], [field]: value };
        setPersons(newPersons);
    };

    const generateParticipantLink = async () => {
        setIsGeneratingLink(true);
        setShowTipBanner(false);

        try {
            // Get current session to extract user information
            const sessionData = await getSession();
            const userName = sessionData?.data?.session?.user?.name || 'Event Organizer';

            const response = await fetch(`/api/events/registration-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventName: eventName || 'Secret Santa Event',
                    organizerName: userName,
                    notificationChannels: notificationChannels
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate registration link');
            }

            const { linkId } = await response.json();
            // Use query parameter format that will definitely work
            const generatedLink = `${window.location.origin}/?join=${linkId}`;

            setParticipantLink(generatedLink);

            // Start polling for new participants
            startPollingForParticipants(linkId);
        } catch (error) {
            console.error('Error generating link:', error);
            alert('Failed to generate registration link. Please try again.');
        } finally {
            setIsGeneratingLink(false);
        }
    };

    const copyLinkToClipboard = async () => {
        if (participantLink) {
            try {
                await navigator.clipboard.writeText(participantLink);
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy link:', err);
            }
        }
    };

    const dismissTipBanner = () => {
        setShowTipBanner(false);
    };

    const selectJoinedParticipant = (joinedParticipant: Person, joinedIndex: number) => {
        // Find the first empty participant slot
        const emptySlotIndex = persons.findIndex(p => !p.name && !p.email);

        // Ensure participant has a phone number, default to empty pattern if missing
        const participantWithPhone = {
            ...joinedParticipant,
            phone: joinedParticipant.phone || "000-000-0000"
        };

        if (emptySlotIndex !== -1) {
            // Fill the empty slot
            const newPersons = [...persons];
            newPersons[emptySlotIndex] = participantWithPhone;
            setPersons(newPersons);
        } else {
            // Add as a new participant if no empty slots and under limit
            if (persons.length < 50) {
                setPersons([...persons, participantWithPhone]);
            }
        }

        // Add to selected emails to prevent showing again
        setSelectedParticipantEmails(prev => {
            if (!prev.includes(joinedParticipant.email)) {
                return [...prev, joinedParticipant.email];
            }
            return prev;
        });

        // Remove from joined participants immediately 
        setJoinedParticipants(prev => prev.filter((_, index) => index !== joinedIndex));
    };

    const openRestrictionsModal = (participantIndex: number) => {
        setSelectedParticipantIndex(participantIndex);
        setRestrictionsModalOpen(true);
    };

    const handleSaveRestrictions = (participantIndex: number, restrictedIndices: number[]) => {
        setRestrictions(prev => ({
            ...prev,
            [participantIndex]: restrictedIndices
        }));
    };

    const handleMatch = async () => {
        try {
            // Get current session to extract user ID
            const sessionData = await getSession();
            console.log('Current session:', session);
            const userId = sessionData?.data?.session.userId;

            if (!userId) {
                alert('You must be logged in to create an event.');
                return;
            }

            // Build participants array with restrictions
            const participantsData = persons.map((person, index) => {
                const participantRestrictions = restrictions[index] || [];

                // Convert restriction indices to emails
                const restrictionEmails = participantRestrictions
                    .map(restrictedIndex => {
                        const restrictedPerson = persons[restrictedIndex];
                        return restrictedPerson ? restrictedPerson.email : null;
                    })
                    .filter(email => email !== null);

                return {
                    name: person.name,
                    email: person.email,
                    phoneNumber: person.phone || '',
                    restrictions: restrictionEmails.length > 0 ? restrictionEmails : undefined
                };
            });

            const eventData = {
                name: eventName,
                date: new Date().toISOString(),
                budget: parseInt(amount),
                location: location,
                userId: userId,
                notificationChannels: notificationChannels,
                participants: participantsData
            };

            console.log('Creating event with payload:', eventData);

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create event');
            }

            const createdEvent = await response.json();
            console.log('Event created successfully:', createdEvent);

            // Reset selected participants state since event is now created
            setSelectedParticipantEmails([]);

            onEventCreated();
        } catch (error) {
            console.error('Error creating event:', error);
            alert(`Failed to create event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const renderStep1 = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Event Details</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Name</label>
                    <input
                        type="text"
                        placeholder="e.g., Christmas Party 2024"
                        value={eventName}
                        onChange={e => setEventName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Amount</label>
                    <input
                        type="number"
                        placeholder="Enter gift budget amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Location</label>
                    <input
                        type="text"
                        placeholder="e.g., Office, Home, Community Center"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Methods</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Select how participants will receive their match information. You can choose multiple methods.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={notificationChannels.includes("email")}
                                onChange={() => toggleNotificationChannel("email")}
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-500 border-gray-300 focus:ring-emerald-500/20 rounded"
                            />
                            <div className="ml-3 flex items-center">
                                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">Email</span>
                            </div>
                            {notificationChannels.includes("email") && (
                                <div className="absolute inset-0 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl"></div>
                            )}
                        </label>
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={notificationChannels.includes("sms")}
                                onChange={() => toggleNotificationChannel("sms")}
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-500 border-gray-300 focus:ring-emerald-500/20 rounded"
                            />
                            <div className="ml-3 flex items-center">
                                <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">SMS</span>
                            </div>
                            {notificationChannels.includes("sms") && (
                                <div className="absolute inset-0 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl"></div>
                            )}
                        </label>
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="checkbox"
                                checked={notificationChannels.includes("whatsapp")}
                                onChange={() => toggleNotificationChannel("whatsapp")}
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-500 border-gray-300 focus:ring-emerald-500/20 rounded"
                            />
                            <div className="ml-3 flex items-center">
                                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">WhatsApp</span>
                            </div>
                            {notificationChannels.includes("whatsapp") && (
                                <div className="absolute inset-0 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl"></div>
                            )}
                        </label>
                    </div>
                    {notificationChannels.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                <strong>Required fields for participants:</strong>
                                {" Name (always required)"}
                                {requiresEmail && ", Email"}
                                {requiresPhoneNumber && ", Phone number"}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Add Participants</h2>
            {showTipBanner && !participantLink && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-normal text-green-800">
                                Want to avoid typing each participant yourself?
                            </h3>
                            <p className="mt-1 text-sm text-green-700">
                                Send a link to participants so they can fill up their own information and it will be filled automatically here.
                            </p>
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={generateParticipantLink}
                                    disabled={isGeneratingLink}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isGeneratingLink ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Link className="h-4 w-4 mr-2" />
                                            Generate Link
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={dismissTipBanner}
                                    className="text-green-700 border border-green-300 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={dismissTipBanner}
                            className="flex-shrink-0 ml-2 text-green-400 hover:text-green-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
            {participantLink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-normal text-blue-800">
                                Participant Registration Link Generated
                            </h3>
                            <p className="mt-1 text-sm text-blue-700">
                                Share this link with participants. They'll be automatically added here when they register.
                            </p>
                            <div className="mt-3 flex items-center gap-2 p-2 bg-white rounded border border-blue-200">
                                <Link className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <code className="flex-1 text-sm text-blue-800 bg-transparent break-all">
                                    {participantLink}
                                </code>
                                <button
                                    onClick={copyLinkToClipboard}
                                    className="flex-shrink-0 border border-blue-300 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center"
                                >
                                    {linkCopied ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4 mr-1" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-blue-600">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Waiting for participants to register...
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-normal text-gray-900 dark:text-gray-100">Participants</label>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{persons.length} participant{persons.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="space-y-3">
                        {persons.map((p, idx) => (
                            <div key={idx} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-white dark:bg-gray-700">
                                <div className={`grid gap-4 items-start ${requiresEmail && requiresPhoneNumber ? 'grid-cols-1 sm:grid-cols-3' : requiresEmail || requiresPhoneNumber ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full name *"
                                            value={p.name}
                                            onChange={e => updatePerson(idx, "name", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                        />
                                    </div>
                                    {requiresEmail && (
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Email address *"
                                                value={p.email}
                                                onChange={e => updatePerson(idx, "email", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                            />
                                        </div>
                                    )}
                                    {requiresPhoneNumber && (
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Phone number *"
                                                value={p.phone || ''}
                                                onChange={e => updatePerson(idx, "phone", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openRestrictionsModal(idx)}
                                        className="border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/80 h-10 flex-1 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg font-medium flex items-center justify-center"
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Restrictions
                                        {restrictions[idx] && restrictions[idx].length > 0 && (
                                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                                {restrictions[idx].length}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => removePerson(idx)}
                                        disabled={persons.length <= 1}
                                        className="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-10 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:border-gray-200 rounded-lg font-medium flex items-center justify-center"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addPerson}
                            className="w-full border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/80 h-11 bg-white dark:bg-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Participant
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <JoinedParticipants
                    participantLink={participantLink}
                    joinedParticipants={joinedParticipants}
                    selectJoinedParticipant={selectJoinedParticipant}
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Review & Match</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Event Details</h3>
                    <p className="text-gray-800 dark:text-gray-200"><strong className="text-gray-900 dark:text-gray-100">Event Name:</strong> {eventName}</p>
                    <p className="text-gray-800 dark:text-gray-200"><strong className="text-gray-900 dark:text-gray-100">Budget:</strong> ${amount}</p>
                    <p className="text-gray-800 dark:text-gray-200"><strong className="text-gray-900 dark:text-gray-100">Location:</strong> {location}</p>
                    <p className="text-gray-800 dark:text-gray-200"><strong className="text-gray-900 dark:text-gray-100">Notification Methods:</strong> {notificationChannels.join(", ")}</p>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Participants</h3>
                    <ul className="space-y-1">
                        {persons.map((p, i) => <li key={i} className="text-gray-800 dark:text-gray-200">{p.name} - {p.email}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );

    const renderStep = () => {
        switch (step) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            default:
                return renderStep1();
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={onEventCreated} className="mb-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
            </button>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                <div className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <div className={`text-sm font-medium ${step >= 1 ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>Event Details</div>
                            <div className={`text-sm font-medium ${step >= 2 ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>Add Participants</div>
                            <div className={`text-sm font-medium ${step >= 3 ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>Review & Match</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div className="bg-emerald-500 dark:bg-emerald-400 h-2 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>
                    </div>

                    {renderStep()}

                    <div className="flex justify-between mt-8">
                        {step > 1 && <button onClick={prevStep} className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl transition-colors flex items-center font-medium"><ArrowLeft className="h-4 w-4 mr-2" />Back</button>}
                        <div />
                        {step < 3 && <button onClick={handleNext} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center">Next<ArrowRight className="h-4 w-4 ml-2" /></button>}
                        {step === 3 && <button onClick={handleMatch} className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center">Generate Matches</button>}
                    </div>
                </div>
            </div>

            {/* Restrictions Modal */}
            <RestrictionsModal
                isOpen={restrictionsModalOpen}
                onClose={() => setRestrictionsModalOpen(false)}
                currentParticipant={persons[selectedParticipantIndex]}
                currentParticipantIndex={selectedParticipantIndex}
                allParticipants={persons}
                currentRestrictions={restrictions[selectedParticipantIndex] || []}
                onSaveRestrictions={handleSaveRestrictions}
            />
        </div>
    );
}
