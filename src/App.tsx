import { useState, useEffect } from "react";
import { useSession, signOut } from "./lib/auth-client";
import { SignInForm } from "./components/auth/SignInForm";
import { SignUpForm } from "./components/auth/SignUpForm";
import { Dashboard } from "./components/Dashboard";
import { APP_CONFIG } from "./constants";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { PricingSection } from "./components/PricingSection";
import { Footer } from "./components/Footer";
import { Database, Plus, RefreshCw } from "lucide-react";

interface Item {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

function App() {
    const [showLandingPage, setShowLandingPage] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [count, setCount] = useState(0);
    const [name, setName] = useState("unknown");
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const { data: session, isPending } = useSession();

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/items");
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch items:", error);
        } finally {
            setLoading(false);
        }
    };

    const createExampleItem = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: `Example Item ${Date.now()}`,
                    description: "This is an example item created from the frontend"
                }),
            });

            if (response.ok) {
                await fetchItems();
            }
        } catch (error) {
            console.error("Failed to create item:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        setShowLandingPage(false);
    };

    const handleToggleAuthMode = () => {
        setIsSignUp((prev) => !prev);
    };

    const handleGetStarted = () => {
        if (session) {
            setShowLandingPage(false);
        } else {
            setShowAuthModal(true);
            setIsSignUp(true);
        }
    };

    const handleSignInClick = () => {
        setShowAuthModal(true);
        setIsSignUp(false);
    };

    useEffect(() => {
        if (session) {
            fetchItems();
        }
    }, [session]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Show landing page for non-authenticated users or when explicitly requested
    if (showLandingPage && !session) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <Navigation
                    session={session || undefined}
                    onSignOut={handleSignOut}
                    onSignIn={handleSignInClick}
                />
                <HeroSection onGetStarted={handleGetStarted} />
                <div id="features">
                    <FeaturesSection />
                </div>
                <div id="how-it-works">
                    <HowItWorksSection />
                </div>
                <PricingSection onGetStarted={handleGetStarted} />
                <Footer />

                {/* Auth Modal */}
                {showAuthModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {isSignUp ? "Create Account" : "Welcome Back"}
                                </h3>
                                <button
                                    onClick={() => setShowAuthModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    ✕
                                </button>
                            </div>

                            {isSignUp ? (
                                <SignUpForm onSuccess={handleAuthSuccess} onToggleMode={handleToggleAuthMode} />
                            ) : (
                                <SignInForm onSuccess={handleAuthSuccess} onToggleMode={handleToggleAuthMode} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Show dashboard for authenticated users
    if (session && !showLandingPage) {
        return (
            <Dashboard
                onSignOut={() => {
                    handleSignOut();
                    setShowLandingPage(true);
                }}
                onBackToLanding={() => setShowLandingPage(true)}
            />
        );
    }

    // Show admin dashboard (old implementation - fallback)
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <Navigation
                session={session || undefined}
                onSignOut={() => {
                    handleSignOut();
                    setShowLandingPage(true);
                }}
                onSignIn={handleSignInClick}
            />

            {/* Admin Dashboard */}
            <main className="max-w-6xl mx-auto px-4 py-8 mt-16">
                {/* Welcome Section */}
                {session && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Welcome to {APP_CONFIG.name}! 🎁
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Hello {session.user.name}, ready to create some magical gift exchanges?
                                </p>
                            </div>
                            <button
                                onClick={() => setShowLandingPage(true)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                            >
                                ← Back to Landing
                            </button>
                        </div>
                    </div>
                )}

                {/* Demo Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">React State Demo</h3>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">{count}</div>
                            <button
                                onClick={() => setCount((count) => count + 1)}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                Increment Counter
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API Connection Test</h3>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                                API Response: <span className="font-mono">{name}</span>
                            </div>
                            <button
                                onClick={() => {
                                    fetch("/api/")
                                        .then((res) => res.json() as Promise<{ name: string }>)
                                        .then((data) => setName(data.name));
                                }}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                Test API Call
                            </button>
                        </div>
                    </div>
                </div>

                {/* Database Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Database Management</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Manage items with Drizzle ORM & D1</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={createExampleItem}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-4 h-4" />
                            {loading ? "Creating..." : "Create Example Item"}
                        </button>
                        <button
                            onClick={fetchItems}
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? "Refreshing..." : "Refresh Items"}
                        </button>
                    </div>
                </div>

                {/* Items Display */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Database Items</h3>
                        <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-semibold">
                            {items.length} items
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                            <p className="text-gray-600 dark:text-gray-400">Loading items...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12">
                            <Database className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No items yet</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by creating your first item!</p>
                            <button
                                onClick={createExampleItem}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                Create First Item
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {items.map((item, index) => (
                                <div key={item.id} className="group border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                                    {index + 1}
                                                </div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {item.name}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 ml-11 text-xs text-gray-500 dark:text-gray-500">
                                                <span>ID: {item.id}</span>
                                                <span>•</span>
                                                <span>Created: {new Date(item.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
