export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get your gift exchange running in minutes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-normal text-xl">1</span>
            </div>
            <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Create Event</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Set up your event with participants, budget limits, and any special restrictions
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-normal text-xl">2</span>
            </div>
            <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Smart Matching</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our algorithm generates perfect matches while respecting all your constraints
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-normal text-xl">3</span>
            </div>
            <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Automated Delivery</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Participants receive their matches instantly via their preferred communication method
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
