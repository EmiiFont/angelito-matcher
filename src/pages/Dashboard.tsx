import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Gift,
    Users,
    Mail,
    Settings,
    Home,
    Plus,
    Calendar,
    BarChart3,
    LogOut,
    Menu,
    X,
    MessageSquare,
    Phone,
    Trash2,
    Link,
    Copy,
    CheckCircle,
    Lightbulb,
    Loader2,
    UserCheck,
    ArrowLeft
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

    const sidebarItems = [
        { icon: Home, label: "Dashboard", active: true },
        { icon: Gift, label: "Events", active: false },
        { icon: Users, label: "Participants", active: false },
        { icon: Calendar, label: "Calendar", active: false },
        { icon: BarChart3, label: "Analytics", active: false },
        { icon: Settings, label: "Settings", active: false },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className={`bg-white border-r border-sky-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-64 hidden lg:block'
                }`}>
                <div className="flex items-center justify-between p-6 border-b border-sky-200">
                    <div className="flex items-center">
                        <Gift className="h-8 w-8 text-sky-600" />
                        <span className="ml-3 text-xl font-bold text-gray-900">Angelito</span>
                    </div>
                    <button
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <nav className="mt-6">
                    {sidebarItems.map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${item.active
                                ? 'text-sky-600 bg-sky-50 border-r-2 border-sky-600'
                                : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'
                                }`}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-64 p-6 border-t border-sky-200">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Mobile sidebar overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-sky-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                className="lg:hidden mr-4"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu className="h-6 w-6 text-gray-500" />
                            </button>
                            <h1 className="text-2xl font-normal text-gray-900">Create New Event</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">JD</span>
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-700">John Doe</span>
                            </div>
                        </div>
                    </div>
                </header>

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
                                            <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center mr-4">
                                                <Gift className="h-5 w-5 text-sky-600" />
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
                                                        className="w-20 text-center border-gray-300 focus:border-sky-500 focus:ring-sky-500/20"
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
                                                className="w-full sm:w-64 border-gray-300 focus:border-sky-500 focus:ring-sky-500/20"
                                            />
                                        </div>

                                        {/* Notification Channel Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-3">Notification Method</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="email"
                                                        checked={notificationChannel === "email"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">Email</span>
                                                    </div>
                                                    {notificationChannel === "email" && (
                                                        <div className="absolute inset-0 border border-sky-500 bg-sky-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="sms"
                                                        checked={notificationChannel === "sms"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <MessageSquare className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">SMS</span>
                                                    </div>
                                                    {notificationChannel === "sms" && (
                                                        <div className="absolute inset-0 border border-sky-500 bg-sky-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="whatsapp"
                                                        checked={notificationChannel === "whatsapp"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <Phone className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">WhatsApp</span>
                                                    </div>
                                                    {notificationChannel === "whatsapp" && (
                                                        <div className="absolute inset-0 border border-sky-500 bg-sky-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                                <label className="relative flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-sky-300 transition-colors">
                                                    <input
                                                        type="radio"
                                                        name="notificationChannel"
                                                        value="all"
                                                        checked={notificationChannel === "all"}
                                                        onChange={e => setNotificationChannel(e.target.value as NotificationChannel)}
                                                        className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500/20"
                                                    />
                                                    <div className="ml-3 flex items-center">
                                                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                                                        <span className="text-sm text-gray-900">All Methods</span>
                                                    </div>
                                                    {notificationChannel === "all" && (
                                                        <div className="absolute inset-0 border border-sky-500 bg-sky-50/30 rounded-lg"></div>
                                                    )}
                                                </label>
                                            </div>
                                            {requiresPhoneNumber() && (
                                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <p className="text-sm text-blue-700 flex items-center">
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
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0">
                                                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                                    </div>
                                                    <div className="ml-3 flex-1">
                                                        <h3 className="text-sm font-medium text-blue-800">
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
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={copyLinkToClipboard}
                                                                className="flex-shrink-0 border-blue-300 text-blue-700 hover:bg-blue-50"
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
                                                        <div className="mt-3 flex items-center text-sm text-blue-600">
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
                                                                    className="border-gray-300 focus:border-sky-500 focus:ring-sky-500/20"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Input
                                                                    type="email"
                                                                    placeholder="Email address"
                                                                    value={p.email}
                                                                    onChange={e => updatePerson(idx, "email", e.target.value)}
                                                                    className="border-gray-300 focus:border-sky-500 focus:ring-sky-500/20"
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
                                                                    className="border-gray-300 focus:border-sky-500 focus:ring-sky-500/20"
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
                                                    className="bg-sky-600 hover:bg-sky-700 text-white px-8 h-12 font-medium"
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
                                    <Card className="bg-white shadow-sm border-sky-200">
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
                                                className="bg-sky-600 hover:bg-sky-700 text-white"
                                            >
                                                Create New Event
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>

                            {/* Joined Participants Widget */}
                            {participantLink && joinedParticipants.length > 0 && (
                                <div className="lg:col-span-1">
                                    <Card className="bg-white border border-gray-200 sticky top-6">
                                        <CardContent className="p-0">
                                            <div className="border-b border-gray-100 p-4">
                                                <div className="flex items-center">
                                                    <UserCheck className="h-5 w-5 text-green-600 mr-2" />
                                                    <h3 className="text-sm font-medium text-gray-900">Joined Participants</h3>
                                                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                        {joinedParticipants.length}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Select participants to add them to your event
                                                </p>
                                            </div>
                                            <div className="p-4 max-h-96 overflow-y-auto">
                                                <div className="space-y-3">
                                                    {joinedParticipants.map((participant, index) => (
                                                        <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center mb-1">
                                                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                                                            <span className="text-green-600 text-xs font-medium">
                                                                                {participant.name.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                                            {participant.name}
                                                                        </p>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500 truncate mb-1">
                                                                        {participant.email}
                                                                    </p>
                                                                    {participant.phone && (
                                                                        <p className="text-xs text-gray-500 truncate">
                                                                            {participant.phone}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => selectJoinedParticipant(participant, index)}
                                                                    className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-7"
                                                                >
                                                                    <ArrowLeft className="h-3 w-3 mr-1" />
                                                                    Select
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Restriction Modal */}
            {restrictionIndex !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
                        <h2 className="font-bold text-lg text-gray-900 mb-4">
                            {persons[restrictionIndex].name || `Person ${restrictionIndex + 1}`} can't match with
                        </h2>
                        <div className="space-y-3 mb-6">
                            {persons.map((p, idx) =>
                                idx === restrictionIndex ? null : (
                                    <label key={idx} className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={tempRestrictions.includes(idx)}
                                            onChange={e => {
                                                setTempRestrictions(prev =>
                                                    e.target.checked
                                                        ? [...prev, idx]
                                                        : prev.filter(i => i !== idx),
                                                );
                                            }}
                                            className="w-4 h-4 text-sky-600 border-sky-300 rounded focus:ring-sky-500"
                                        />
                                        <span className="text-gray-700">
                                            {p.name || `Person ${idx + 1}`}
                                        </span>
                                    </label>
                                ),
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setRestrictionIndex(null)}
                                className="border-sky-300 text-sky-700 hover:bg-sky-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => saveRestriction(tempRestrictions)}
                                className="bg-sky-600 hover:bg-sky-700 text-white"
                            >
                                Save Restrictions
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
