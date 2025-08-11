import { Users, Settings, Brain, Send, CheckCircle } from "lucide-react";
import { APP_CONFIG } from "../constants";

const steps = [
  {
    step: 1,
    icon: Users,
    title: "Add Participants",
    description: "Invite friends, family, or colleagues to your gift exchange. Add their contact details and any special preferences.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    step: 2,
    icon: Settings,
    title: "Set Rules & Restrictions",
    description: "Configure budget limits, exclusions (couples, family members), and any other preferences to ensure perfect matches.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    step: 3,
    icon: Brain,
    title: "AI Matching Magic",
    description: "Our intelligent algorithm analyzes all constraints and creates optimal pairings while maintaining complete secrecy.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    step: 4,
    icon: Send,
    title: "Automated Delivery",
    description: "Assignments are automatically sent to participants via their preferred method: WhatsApp, SMS, or email.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    step: 5,
    icon: CheckCircle,
    title: "Track & Manage",
    description: "Monitor your event with our admin dashboard. See who's received their assignments and manage any changes.",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Launch your perfect gift exchange in 5 simple steps. No technical expertise required.
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 via-indigo-200 via-blue-200 to-blue-300 dark:from-blue-800 dark:via-blue-700 dark:via-indigo-800 dark:via-blue-700 dark:to-blue-600 -translate-y-1/2"></div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className={`${step.bgColor} rounded-2xl p-8 text-center relative z-10 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                  {/* Step Number */}
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-6 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-20">
                    <div className="w-4 h-4 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to create your first gift exchange?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of happy users who've simplified their gift exchanges with {APP_CONFIG.name}.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1">
              Start Free Today 🎁
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}