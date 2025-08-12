import { useState } from "react";
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


type NotificationChannel = "email" | "sms" | "whatsapp" | "all";

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
    const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>("email");
    const [showTipBanner, setShowTipBanner] = useState(true);
    const [participantLink, setParticipantLink] = useState<string | null>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [joinedParticipants, setJoinedParticipants] = useState<Person[]>([]);
    const [restrictionsModalOpen, setRestrictionsModalOpen] = useState(false);
    const [selectedParticipantIndex, setSelectedParticipantIndex] = useState<number>(0);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

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
                if (!person.name.trim() || !person.email.trim() || !person.phone?.trim()) {
                    alert("Please fill in the name, email, and phone number for all participants.");
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

        // Simulate API call to generate link
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate a random link ID
        const linkId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const generatedLink = `${window.location.origin}/join/${linkId}`;

        setParticipantLink(generatedLink);
        setIsGeneratingLink(false);
        setShowTipBanner(false);

        // Simulate some participants joining via the link after a delay
        setTimeout(() => {
            setJoinedParticipants([
                { name: "Sarah Johnson", email: "sarah.j@email.com", phone: "+1-555-0123" },
                { name: "Mike Chen", email: "mike.chen@gmail.com", phone: "+1-555-0124" },
                { name: "Ana Rodriguez", email: "ana.r@company.com", phone: "+1-555-0125" }
            ]);
        }, 3000);
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

        if (emptySlotIndex !== -1) {
            // Fill the empty slot
            const newPersons = [...persons];
            newPersons[emptySlotIndex] = { ...joinedParticipant };
            setPersons(newPersons);
        } else {
            // Add as a new participant if no empty slots and under limit
            if (persons.length < 50) {
                setPersons([...persons, { ...joinedParticipant }]);
            }
        }

        // Remove from joined participants
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="radio"
                                name="notificationChannel"
                                value="email"
                                checked={notificationChannel === "email"}
                                onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-500 border-gray-300 focus:ring-emerald-500/20"
                            />
                            <div className="ml-3 flex items-center">
                                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">Email</span>
                            </div>
                            {notificationChannel === "email" && (
                                <div className="absolute inset-0 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl"></div>
                            )}
                        </label>
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="radio"
                                name="notificationChannel"
                                value="sms"
                                checked={notificationChannel === "sms"}
                                onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-500 border-gray-300 focus:ring-emerald-500/20"
                            />
                            <div className="ml-3 flex items-center">
                                <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">SMS</span>
                            </div>
                            {notificationChannel === "sms" && (
                                <div className="absolute inset-0 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl"></div>
                            )}
                        </label>
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="radio"
                                name="notificationChannel"
                                value="whatsapp"
                                checked={notificationChannel === "whatsapp"}
                                onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                className="w-4 h-4 text-emerald-600 dark:text-emerald-500 border-gray-300 focus:ring-emerald-500/20"
                            />
                            <div className="ml-3 flex items-center">
                                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">WhatsApp</span>
                            </div>
                            {notificationChannel === "whatsapp" && (
                                <div className="absolute inset-0 border-2 border-emerald-500 dark:border-emerald-400 rounded-xl"></div>
                            )}
                        </label>
                    </div>
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
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Full name"
                                            value={p.name}
                                            onChange={e => updatePerson(idx, "name", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Email address"
                                            value={p.email}
                                            onChange={e => updatePerson(idx, "email", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel"
                                            placeholder="Phone number"
                                            value={p.phone || ''}
                                            onChange={e => updatePerson(idx, "phone", e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white transition-colors"
                                        />
                                    </div>
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
                    <p className="text-gray-800 dark:text-gray-200"><strong className="text-gray-900 dark:text-gray-100">Notification Method:</strong> {notificationChannel}</p>
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
