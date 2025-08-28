import { Brain, MessageSquare, Shield, Settings, Users, Zap } from "lucide-react";
import { APP_CONFIG } from "../constants";

const features = [
    {
        icon: Brain,
        title: "Automated Matching",
        description: "Smart algorithm considers preferences and restrictions to create perfect gift pairings while maintaining complete secrecy.",
        color: "from-blue-500 to-blue-600"
    },
    {
        icon: MessageSquare,
        title: "Automated Notifications",
        description: "Send match assignments via WhatsApp, SMS, or email. Participants receive their assignments securely and instantly.",
        color: "from-green-500 to-green-600"
    },
    {
        icon: Shield,
        title: "Complete Privacy",
        description: "Only the system knows all pairings. Maintain the magic and surprise of gift exchanges with our secure matching system.",
        color: "from-green-500 to-green-600"
    },
    {
        icon: Settings,
        title: "Custom Restrictions",
        description: "Set budget limits, exclude specific pairings, and configure rules to match your group's needs perfectly.",
        color: "from-gray-500 to-gray-600"
    },
    {
        icon: Users,
        title: "Easy Management",
        description: "Track event status, track if each participant know their match already, reveal participant matches for group organizer. No technical skills required.",
        color: "from-indigo-500 to-indigo-600"
    },
    {
        icon: Zap,
        title: "Instant Setup",
        description: "Create and launch your gift exchange in minutes. From participant list to matched assignments in just a few clicks.",
        color: "from-indigo-500 to-indigo-600"
    }
];

export function FeaturesSection() {
    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Everything you need for perfect{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">
                            gift exchanges
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        From automated matching to automated delivery, {APP_CONFIG.name} handles every detail
                        so you can focus on the joy of giving.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:-translate-y-2"
                        >
                            <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
            </div>
        </section>
    );
}
