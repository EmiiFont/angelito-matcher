import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
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
    Loader2
} from "lucide-react";

const LOCAL_STORAGE_KEY = "giftMatcherData";

interface DashboardProps {
    onLogout?: () => void;
}

type NotificationChannel = "email" | "sms" | "whatsapp" | "all";

interface Person {
    name: string;
    email: string;
    phone?: string;
}

export function Dashboard({ onLogout }: DashboardProps) {
    const [persons, setPersons] = useState<Person[]>([{ name: "", email: "" }]);
    const [restrictionIndex, setRestrictionIndex] = useState<number | null>(null);
    const [restrictions, setRestrictions] = useState<Record<number, number[]>>({});
    const [matches, setMatches] = useState<number[] | null>(null);
    const [amount, setAmount] = useState("");
    const [tempRestrictions, setTempRestrictions] = useState<number[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notificationChannel, setNotificationChannel] = useState<NotificationChannel>("email");
    const [showTipBanner, setShowTipBanner] = useState(true);
    const [participantLink, setParticipantLink] = useState<string | null>(null);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [participantCount, setParticipantCount] = useState(1);
    const [joinedParticipants, setJoinedParticipants] = useState<Person[]>([]);

    // Load saved data on mount
    useEffect(() => {
        const raw = typeof localStorage !== "undefined" &&
            localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return;
        try {
            const data = JSON.parse(raw);
            if (Array.isArray(data.persons)) {
                setPersons(data.persons);
                setParticipantCount(data.persons.length);
            }
            if (data.restrictions) setRestrictions(data.restrictions);
            if (typeof data.amount === "string") setAmount(data.amount);
            if (data.notificationChannel) setNotificationChannel(data.notificationChannel);
        } catch (err) {
            console.error("Failed to parse saved data", err);
        }
    }, []);

    // Persist form data while editing
    useEffect(() => {
        if (matches) return; // don't save after matching
        const data = JSON.stringify({ persons, restrictions, amount, notificationChannel });
        localStorage.setItem(LOCAL_STORAGE_KEY, data);
    }, [persons, restrictions, amount, notificationChannel, matches]);

    useEffect(() => {
        if (restrictionIndex !== null) {
            setTempRestrictions(restrictions[restrictionIndex] ?? []);
        }
    }, [restrictionIndex]);

    const addPerson = () => {
        const newCount = persons.length + 1;
        if (newCount <= 50) {
            setParticipantCount(newCount);
            setPersons([...persons, { name: "", email: "" }]);
        }
    };

    const removePerson = (index: number) => {
        if (persons.length <= 1) return; // Don't allow removing the last person
        const newCount = persons.length - 1;
        setParticipantCount(newCount);
        
        const newPersons = persons.filter((_, idx) => idx !== index);
        setPersons(newPersons);
        
        // Update restrictions to account for removed person
        const updatedRestrictions: Record<number, number[]> = {};
        Object.keys(restrictions).forEach((key) => {
            const personIndex = parseInt(key);
            if (personIndex !== index) {
                // Adjust index if it's after the removed person
                const newIndex = personIndex > index ? personIndex - 1 : personIndex;
                // Filter out references to the removed person and adjust other indices
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

    const requiresPhoneNumber = () => {
        return notificationChannel === "sms" || notificationChannel === "whatsapp" || notificationChannel === "all";
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

    const updateParticipantCount = (newCount: number) => {
        const clampedCount = Math.max(1, Math.min(50, newCount)); // Min 1, Max 50
        setParticipantCount(clampedCount);
        
        const currentCount = persons.length;
        const newPersons = [...persons];
        
        if (clampedCount > currentCount) {
            // Add new empty persons
            for (let i = currentCount; i < clampedCount; i++) {
                newPersons.push({ name: "", email: "" });
            }
        } else if (clampedCount < currentCount) {
            // Remove persons from the end
            newPersons.splice(clampedCount);
            
            // Update restrictions to remove references to removed persons
            const updatedRestrictions: Record<number, number[]> = {};
            Object.keys(restrictions).forEach((key) => {
                const personIndex = parseInt(key);
                if (personIndex < clampedCount) {
                    const adjustedRestrictions = restrictions[personIndex]
                        .filter(restrictedIndex => restrictedIndex < clampedCount);
                    if (adjustedRestrictions.length > 0) {
                        updatedRestrictions[personIndex] = adjustedRestrictions;
                    }
                }
            });
            setRestrictions(updatedRestrictions);
        }
        
        setPersons(newPersons);
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

    const saveRestriction = (values: number[]) => {
        if (restrictionIndex === null) return;
        setRestrictions({
            ...restrictions,
            [restrictionIndex]: values,
        });
        setRestrictionIndex(null);
    };

    const shuffle = <T,>(array: T[]): T[] => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    const handleMatch = async () => {
        // Validate required phone numbers
        if (requiresPhoneNumber()) {
            const missingPhones = persons.some(p => !p.phone?.trim());
            if (missingPhones) {
                alert("Phone numbers are required for all participants when using SMS, WhatsApp, or All notification methods.");
                return;
            }
        }

        const n = persons.length;
        const indices = Array.from({ length: n }, (_, i) => i);

        for (let attempt = 0; attempt < 1000; attempt++) {
            const shuffled = shuffle(indices);
            let valid = true;
            for (let i = 0; i < n; i++) {
                const target = shuffled[i];
                if (target === i || restrictions[i]?.includes(target)) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                setMatches(shuffled);

                try {
                    await fetch("/api/sendNotifications", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            persons,
                            matches: shuffled,
                            amount,
                            notificationChannel
                        }),
                    });
                } catch (err) {
                    console.error(err);
                }

                return;
            }
        }
        alert("Couldn't generate a valid match with current restrictions.");
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className={`mx-auto ${participantLink && joinedParticipants.length > 0 ? 'max-w-7xl' : 'max-w-4xl'}`}>
                        <div className={`${participantLink && joinedParticipants.length > 0 ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : ''}`}>
                            {/* Main Form */}
                            <div className={`${participantLink && joinedParticipants.length > 0 ? 'lg:col-span-2' : ''}`}>
                                {!matches ? (
                                    <Card className="bg-white border border-gray-200">
                                <CardContent className="p-0">
                                    {/* Header */}
                                    <div className="border-b border-gray-100 p-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mr-4">
                                                <Gift className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-medium text-gray-900">Gift Exchange Setup</h2>
                                                <p className="text-sm text-gray-500 mt-0.5">Configure your event details and participants</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-8">
                                        {/* Participant Count */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-3">Number of Participants</label>
                                            <div className="flex items-center space-x-6">
                                                <div className="flex-1 max-w-md">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="50"
                                                        value={participantCount}
                                                        onChange={e => updateParticipantCount(parseInt(e.target.value))}
                                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                                        style={{
                                                            background: `linear-gradient(to right, rgb(14 165 233) 0%, rgb(14 165 233) ${((participantCount - 1) / 49) * 100}%, rgb(229 231 235) ${((participantCount - 1) / 49) * 100}%, rgb(229 231 235) 100%)`
                                                        }}
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                        <span>1</span>
                                                        <span>25</span>
                                                        <span>50</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="50"
                                                        value={participantCount}
                                                        onChange={e => {
                                                            const value = parseInt(e.target.value) || 1;
                                                            updateParticipantCount(value);
                                                        }}
                                                        className="w-20 text-center border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                                    />
                                                    <Users className="h-5 w-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Budget */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-3">Budget Amount</label>
                                            <Input
                                                type="number"
                                                placeholder="Enter gift budget amount"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                className="w-full sm:w-64 border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                            />
                                        </div>

                                        {/* Notification Channel Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-3">Notification Method</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="email"
                                                        checked={notificationChannel === "email"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">Email</span>
                                                    </div>
                                                    {notificationChannel === "email" && (
                                                        <div className="absolute inset-0 border border-purple-500 bg-purple-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="sms"
                                                        checked={notificationChannel === "sms"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">SMS</span>
                                                    </div>
                                                    {notificationChannel === "sms" && (
                                                        <div className="absolute inset-0 border border-purple-500 bg-purple-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="whatsapp"
                                                        checked={notificationChannel === "whatsapp"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">WhatsApp</span>
                                                    </div>
                                                    {notificationChannel === "whatsapp" && (
                                                        <div className="absolute inset-0 border border-purple-500 bg-purple-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-purple-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="all"
                                                        checked={notificationChannel === "all"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">All Methods</span>
                                                    </div>
                                                    {notificationChannel === "all" && (
                                                        <div className="absolute inset-0 border border-purple-500 bg-purple-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                            </div>
                                            {requiresPhoneNumber() && (
                                                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                                    <p className="text-sm text-purple-700 flex items-center">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        Phone numbers will be required for all participants
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Tip Banner */}
                                        {showTipBanner && !participantLink && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <h3 className="text-sm font-medium text-green-800">
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

                                        {/* Generated Link Display */}
                                        {participantLink && (
                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <h3 className="text-sm font-medium text-purple-800">
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

                                        {/* Participants */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="block text-sm font-medium text-gray-900">Participants</label>
                                                <span className="text-sm text-gray-500">{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
                                            </div>
                                            <div className="space-y-3">
                                                {persons.map((p, idx) => (
                                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-4">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
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
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setRestrictionIndex(idx)}
                                                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 h-10 flex-1"
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
                                                        {requiresPhoneNumber() && (
                                                            <div>
                                                                <Input
                                                                    placeholder="Phone number"
                                                                    value={p.phone || ""}
                                                                    onChange={e => updatePerson(idx, "phone", e.target.value)}
                                                                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                <Button
                                                    variant="outline"
                                                    onClick={addPerson}
                                                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-11"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Participant
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Generate Matches */}
                                        <div className="border-t border-gray-100 pt-6">
                                            <div className="flex justify-end">
                                                <Button
                                                    size="lg"
                                                    onClick={handleMatch}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 h-12 font-medium"
                                                >
                                                    <Gift className="h-5 w-5 mr-2" />
                                                    Generate Matches & Send Notifications
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                </Card>
                                ) : (
                                    <Card className="bg-white shadow-sm border-purple-200">
                                        <CardContent className="p-8 text-center">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Gift className="h-8 w-8 text-green-600" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Matches Generated Successfully!</h2>
                                            <p className="text-gray-600 mb-6">
                                                All participants have been matched and notifications have been sent via {notificationChannel === "all" ? "all available methods" : notificationChannel}.
                                            </p>
                                            <Button
                                                onClick={() => {
                                                    setMatches(null);
                                                    setPersons([{ name: "", email: "" }]);
                                                    setParticipantCount(1);
                                                    setAmount("");
                                                    setRestrictions({});
                                                    setNotificationChannel("email");
                                                }}
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                Create New Event
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            <JoinedParticipants
                                participantLink={participantLink}
                                joinedParticipants={joinedParticipants}
                                selectJoinedParticipant={selectJoinedParticipant}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {restrictionIndex !== null && (
                <RestrictionModal
                    persons={persons}
                    restrictionIndex={restrictionIndex}
                    tempRestrictions={tempRestrictions}
                    setTempRestrictions={setTempRestrictions}
                    onSave={saveRestriction}
                    onClose={() => setRestrictionIndex(null)}
                />
            )}
        </div>
    );
}
