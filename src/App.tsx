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

function App() {
    const [showLandingPage, setShowLandingPage] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const { data: session, isPending } = useSession();


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
            setShowLandingPage(false);
        }
    }, [session]);

    if (isPending) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

    // Show landing page (default for non-authenticated users or when explicitly requested)
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

export default App;
