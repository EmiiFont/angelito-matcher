import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { JoinedParticipants } from '@/components/dashboard/JoinedParticipants';
import { RestrictionModal } from '@/components/dashboard/RestrictionModal';
import {
    Gift,
    Users,
    Mail,
    Settings,
    Plus,
    MessageSquare,
    Phone,
    Trash2,
    Link,
    Copy,
    CheckCircle,
    Lightbulb,
    Loader2,
    X,
    ArrowLeft,
    ArrowRight
} from "lucide-react";

const LOCAL_STORAGE_KEY = "giftMatcherData";

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
    const [step, setStep] = useState(1);
    const [eventName, setEventName] = useState("");
    const [persons, setPersons] = useState<Person[]>([{ name: "", email: "" }]);
    const [restrictionIndex, setRestrictionIndex] = useState<number | null>(null);
    const [restrictions, setRestrictions] = useState<Record<number, number[]>>({});
    const [matches, setMatches] = useState<number[] | null>(null);
    const [amount, setAmount] = useState("");
    const [tempRestrictions, setTempRestrictions] = useState<number[]>([]);
    const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>("email");
    const [showTipBanner, setShowTipBanner] = useState(true);
    const [participantLink, setParticipantLink] = useState<string | null>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [participantCount, setParticipantCount] = useState(1);
    const [joinedParticipants, setJoinedParticipants] = useState<Person[]>([]);

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
        }
        if (step === 2) {
            if (persons.length < 2) {
                alert("Please add at least two participants.");
                return;
            }
            for (const person of persons) {
                if (!person.name.trim() || !person.email.trim()) {
                    alert("Please fill in the name and email for all participants.");
                    return;
                }
            }
        }
        nextStep();
    };

    const addPerson = () => {
        const newCount = persons.length + 1;
        if (newCount <= 50) {
            setParticipantCount(newCount);
            setPersons([...persons, { name: "", email: "" }]);
        }
    };

    const removePerson = (index: number) => {
        if (persons.length <= 1) return;
        const newCount = persons.length - 1;
        setParticipantCount(newCount);
        
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
                setParticipantCount(persons.length + 1);
            }
        }
        
        // Remove from joined participants
        setJoinedParticipants(prev => prev.filter((_, index) => index !== joinedIndex));
    };

    const handleMatch = async () => {
        // ... (handleMatch logic from previous implementation)
        onEventCreated();
    };

    const renderStep1 = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4">Event Details</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Name</label>
                    <Input
                        placeholder="e.g., Christmas Party 2024"
                        value={eventName}
                        onChange={e => setEventName(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Amount</label>
                    <Input
                        type="number"
                        placeholder="Enter gift budget amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notification Method</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="radio"
                                name="notificationChannel"
                                value="email"
                                checked={notificationChannel === "email"}
                                onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500/20"
                            />
                            <div className="ml-3 flex items-center">
                                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">Email</span>
                            </div>
                            {notificationChannel === "email" && (
                                <div className="absolute inset-0 border-2 border-purple-400 rounded-lg"></div>
                            )}
                        </label>
                        <label className="relative flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-300 dark:hover:border-purple-500 transition-colors bg-white dark:bg-gray-700">
                            <input
                                type="radio"
                                name="notificationChannel"
                                value="sms"
                                checked={notificationChannel === "sms"}
                                onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500/20"
                            />
                            <div className="ml-3 flex items-center">
                                <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">SMS</span>
                            </div>
                            {notificationChannel === "sms" && (
                                <div className="absolute inset-0 border-2 border-purple-400 rounded-lg"></div>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <h2 className="text-xl font-semibold mb-4">Add Participants</h2>
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
                                <Button
                                    size="sm"
                                    onClick={generateParticipantLink}
                                    disabled={isGeneratingLink}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm"
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
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={dismissTipBanner}
                                    className="text-green-700 border-green-300 hover:bg-green-50"
                                >
                                    Maybe Later
                                </Button>
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
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-normal text-purple-800">
                                Participant Registration Link Generated
                            </h3>
                            <p className="mt-1 text-sm text-purple-700">
                                Share this link with participants. They'll be automatically added here when they register.
                            </p>
                            <div className="mt-3 flex items-center gap-2 p-2 bg-white rounded border border-purple-200">
                                <Link className="h-4 w-4 text-purple-600 flex-shrink-0" />
                                <code className="flex-1 text-sm text-purple-800 bg-transparent break-all">
                                    {participantLink}
                                </code>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={copyLinkToClipboard}
                                    className="flex-shrink-0 border-purple-300 text-purple-700 hover:bg-purple-50"
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
                                </Button>
                            </div>
                            <div className="mt-3 flex items-center text-sm text-purple-600">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                            <div>
                                                <Input
                                                    placeholder="Full name"
                                                    value={p.name}
                                                    onChange={e => updatePerson(idx, "name", e.target.value)}
                                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    type="email"
                                                    placeholder="Email address"
                                                    value={p.email}
                                                    onChange={e => updatePerson(idx, "email", e.target.value)}
                                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setRestrictionIndex(idx)}
                                                className="border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/80 h-10 flex-1 bg-white dark:bg-gray-700"
                                            >
                                                <Settings className="h-4 w-4 mr-2" />
                                                Restrictions
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removePerson(idx)}
                                                disabled={persons.length <= 1}
                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 h-10 px-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:border-gray-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={addPerson}
                            className="w-full border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600/80 h-11 bg-white dark:bg-gray-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Participant
                        </Button>
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
            <h2 className="text-xl font-semibold mb-4">Review & Match</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium mb-2">Event Details</h3>
                    <p><strong>Event Name:</strong> {eventName}</p>
                    <p><strong>Budget:</strong> ${amount}</p>
                    <p><strong>Notification Method:</strong> {notificationChannel}</p>
                </div>
                <div>
                    <h3 className="text-lg font-medium mb-2">Participants</h3>
                    <ul>
                        {persons.map((p, i) => <li key={i}>{p.name} - {p.email}</li>)}
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
            <Button onClick={onEventCreated} variant="outline" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
            </Button>

            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <div className={`text-sm font-medium ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>Event Details</div>
                            <div className={`text-sm font-medium ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>Add Participants</div>
                            <div className={`text-sm font-medium ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>Review & Match</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>
                    </div>

                    {renderStep()}

                    <div className="flex justify-between mt-8">
                        {step > 1 && <Button onClick={prevStep} variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>}
                        <div/>
                        {step < 3 && <Button onClick={handleNext}>Next<ArrowRight className="h-4 w-4 ml-2" /></Button>}
                        {step === 3 && <Button onClick={handleMatch}>Generate Matches</Button>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
