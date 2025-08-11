import { CheckCircle } from 'lucide-react';

interface PricingSectionProps {
  onGetStarted?: () => void;
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-white mb-4">
            Simple, Bundle Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Save more with bundles - perfect for holiday seasons and birthdays
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Free */}
          <div className="border border-blue-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow h-full bg-white dark:bg-gray-800 rounded-lg">
            <div className="p-5 h-full flex flex-col">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-2">Free</h3>
              <div className="mb-3">
                <span className="text-2xl font-normal text-blue-600 dark:text-blue-400">$0</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm">/forever</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Perfect for small groups</p>
              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">7 participants</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Email only</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Basic features</span>
                </li>
              </ul>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white mt-auto text-sm py-2 rounded-md shadow-lg transition-all duration-200"
                onClick={onGetStarted}
              >
                Get Started Free
              </button>
            </div>
          </div>

          {/* Single Event */}
          <div className="border border-blue-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow h-full bg-white dark:bg-gray-800 rounded-lg">
            <div className="p-5 h-full flex flex-col">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-2">Single Event</h3>
              <div className="mb-3">
                <span className="text-2xl font-normal text-blue-600">$1.99</span>
                <span className="text-gray-600 text-sm">/event</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">For one-time users</p>
              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">30 participants</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">All notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Full features</span>
                </li>
              </ul>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white mt-auto text-sm py-2 rounded-md shadow-lg transition-all duration-200"
                onClick={onGetStarted}
              >
                Buy Single Event
              </button>
            </div>
          </div>

          {/* Value Pack - Most Popular */}
          <div className="border-2 border-blue-500 dark:border-blue-400 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow ring-2 ring-blue-500 dark:ring-blue-400 relative h-full bg-white dark:bg-gray-800 rounded-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white px-4 py-1 rounded-full text-sm font-normal shadow-lg">
                Most Popular
              </span>
            </div>
            <div className="p-5 h-full flex flex-col">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-2">Value Pack</h3>
              <div className="mb-3">
                <span className="text-2xl font-normal text-blue-600">$2.99</span>
                <span className="text-gray-600 text-sm">/3 events</span>
              </div>
              <div className="mb-3">
                <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                  Only $1 per event vs $1.99 each
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Perfect for holiday season + birthdays</p>
              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">3 events included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">30 participants each</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">All notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Save $3.98</span>
                </li>
              </ul>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white mt-auto text-sm py-2 rounded-md shadow-lg transition-all duration-200"
                onClick={onGetStarted}
              >
                Get Value Pack ⭐
              </button>
            </div>
          </div>

          {/* Annual Pack */}
          <div className="border border-blue-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow h-full bg-white dark:bg-gray-800 rounded-lg">
            <div className="p-5 h-full flex flex-col">
              <h3 className="text-lg font-normal text-gray-900 dark:text-white mb-2">Annual Pack</h3>
              <div className="mb-3">
                <span className="text-2xl font-normal text-blue-600">$7.99</span>
                <span className="text-gray-600 text-sm">/10 events</span>
              </div>
              <div className="mb-3">
                <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                  Only $0.80 per event
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">For families & organizers</p>
              <ul className="space-y-2 mb-4 flex-grow">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">10 events included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">50 participants each</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">All notifications</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Save $11.91</span>
                </li>
              </ul>
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white mt-auto text-sm py-2 rounded-md shadow-lg transition-all duration-200"
                onClick={onGetStarted}
              >
                Get Annual Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;