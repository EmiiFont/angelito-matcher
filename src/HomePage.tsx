import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Users, Mail, Shield, CheckCircle, Star } from "lucide-react";

interface HomePageProps {
    onGetStarted?: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
            {/* Navigation */}
            <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Gift className="h-8 w-8 text-purple-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">My Angelito</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Features
                                </button>
                                <button
                                    onClick={() => scrollToSection('how-it-works')}
                                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    How It Works
                                </button>
                                <button
                                    onClick={() => scrollToSection('pricing')}
                                    className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Pricing
                                </button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={onGetStarted}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-purple-600 focus:outline-none"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-purple-200">
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-medium w-full text-left"
                                >
                                    Features
                                </button>
                                <button
                                    onClick={() => scrollToSection('how-it-works')}
                                    className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-medium w-full text-left"
                                >
                                    How It Works
                                </button>
                                <button
                                    onClick={() => scrollToSection('pricing')}
                                    className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-medium w-full text-left"
                                >
                                    Pricing
                                </button>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white w-full mt-2"
                                    onClick={onGetStarted}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-16 pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mx-auto max-w-4xl font-display text-5xl font-normal tracking-tight text-slate-900 sm:text-7xl mb-6">
                            Simplify your{" "}
                            <span className="relative whitespace-nowrap text-purple-600">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 418 42"
                                    className="absolute top-2/3 left-0 h-[0.58em] w-full fill-red-300/70"
                                    preserveAspectRatio="none"
                                >
                                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                                </svg>
                                <span className="relative">gift exchange</span>
                            </span>{" "}
                            events
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Automate Secret Santa and White Elephant gift exchanges with intelligent matching,
                            automated notifications, and complete privacy management.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                size="lg"
                                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                                onClick={onGetStarted}
                            >
                                Start Your Event
                            </Button>
                            <Button variant="outline" size="lg" className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 text-lg">
                                Watch Demo
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image/Mockup */}
                    <div className="mt-16 flex justify-center">
                        <Card className="w-full max-w-4xl shadow-2xl border-purple-200">
                            <CardContent className="p-8">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-8 text-white">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold">Christmas Party 2024</h3>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-5 w-5" />
                                            <span>24 participants</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/20 rounded-lg p-4">
                                            <Gift className="h-8 w-8 mb-2" />
                                            <p className="font-semibold">Matches Generated</p>
                                            <p className="text-sm opacity-90">All participants matched</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-4">
                                            <Mail className="h-8 w-8 mb-2" />
                                            <p className="font-semibold">Notifications Sent</p>
                                            <p className="text-sm opacity-90">Via email & SMS</p>
                                        </div>
                                        <div className="bg-white/20 rounded-lg p-4">
                                            <Shield className="h-8 w-8 mb-2" />
                                            <p className="font-semibold">Privacy Protected</p>
                                            <p className="text-sm opacity-90">Complete anonymity</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for Perfect Gift Exchanges
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From simple Secret Santa to complex corporate events, our platform handles all the details
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
                                <p className="text-gray-600">
                                    Intelligent algorithm ensures fair matches while respecting all exclusions and preferences
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Mail className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Notifications</h3>
                                <p className="text-gray-600">
                                    Send match assignments via WhatsApp, SMS, or email with customizable messages
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Privacy</h3>
                                <p className="text-gray-600">
                                    Maintains secrecy - only the system knows all pairings, ensuring surprise is preserved
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Gift className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Budget Management</h3>
                                <p className="text-gray-600">
                                    Set spending limits and gift preferences to ensure everyone's comfort and participation
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
                                <p className="text-gray-600">
                                    Comprehensive event management with real-time status updates and participant tracking
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-purple-200 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Star className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Restrictions</h3>
                                <p className="text-gray-600">
                                    Handle complex scenarios like family exclusions, office hierarchies, and special preferences
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            Get your gift exchange running in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Event</h3>
                            <p className="text-gray-600">
                                Set up your event with participants, budget limits, and any special restrictions
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Matching</h3>
                            <p className="text-gray-600">
                                Our algorithm generates perfect matches while respecting all your constraints
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-xl">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Automated Delivery</h3>
                            <p className="text-gray-600">
                                Participants receive their matches instantly via their preferred communication method
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Pay only for what you use, when you use it
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Free */}
                        <Card className="border-purple-200 hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-6 h-full flex flex-col">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-purple-600">$0</span>
                                    <span className="text-gray-600">/forever</span>
                                </div>
                                <p className="text-gray-600 mb-6">Perfect for small family and friend groups</p>
                                <ul className="space-y-2 mb-6 flex-grow">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Up to 7 participants</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Email notifications only</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Basic restrictions</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Community support</span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-auto"
                                    onClick={onGetStarted}
                                >
                                    Get Started Free
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Per Event */}
                        <Card className="border-purple-500 hover:shadow-lg transition-shadow ring-2 ring-purple-500 relative h-full">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                            <CardContent className="p-6 h-full flex flex-col">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Per Event</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-purple-600">$4.99</span>
                                    <span className="text-gray-600">/event</span>
                                </div>
                                <p className="text-gray-600 mb-6">Perfect for one-time events and larger groups</p>
                                <ul className="space-y-2 mb-6 flex-grow">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Up to 30 participants</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Email, SMS & WhatsApp</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Advanced restrictions</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">24/7 support</span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-auto"
                                    onClick={onGetStarted}
                                >
                                    Start Event
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Business */}
                        <Card className="border-purple-200 hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-6 h-full flex flex-col">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Business</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-purple-600">$12.99</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <p className="text-gray-600 mb-6">Ideal for companies with multiple events</p>
                                <ul className="space-y-2 mb-6 flex-grow">
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Unlimited participants</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">WhatsApp integration</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Advanced restrictions</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Admin dashboard</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle className="h-4 w-4 text-purple-600 mr-2" />
                                        <span className="text-sm text-gray-600">Priority support</span>
                                    </li>
                                </ul>
                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-auto"
                                    onClick={onGetStarted}
                                >
                                    Start Free Trial
                                </Button>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-4 md:mb-0">
                            <Gift className="h-8 w-8 text-purple-400" />
                            <span className="ml-2 text-xl font-bold">My Angelito</span>
                        </div>
                        <div className="text-sm text-gray-400">
                            © 2024 Angelito. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
