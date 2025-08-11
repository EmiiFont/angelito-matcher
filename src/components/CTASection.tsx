import { Gift, Sparkles, Star } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-indigo-300/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-3 -right-3">
                <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Make this holiday season{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-300">
              magical
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of families, offices, and friend groups who've discovered 
            the joy of stress-free gift exchanges.
          </p>

          {/* Social Proof */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
              ))}
            </div>
            <span className="text-blue-100 font-medium ml-2">
              4.9/5 from 2,500+ reviews
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onGetStarted}
              className="group bg-white hover:bg-gray-50 text-blue-600 px-10 py-5 text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Start Your Free Event
                <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
            <button className="border-2 border-white/30 hover:border-white/50 text-white hover:bg-white/10 px-10 py-5 text-xl font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300">
              View Demo
            </button>
          </div>

          {/* Features list */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-blue-100">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>100% Free to start</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span>Setup in 5 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 fill-gray-50 dark:fill-gray-900" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}