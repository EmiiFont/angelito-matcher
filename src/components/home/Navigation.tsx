import { useState } from 'react';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onGetStarted?: () => void;
}

export function Navigation({ onGetStarted }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-xl font-normal text-gray-900">My Angelito</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-normal transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-normal transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-normal transition-colors"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
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
                className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-normal w-full text-left"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-normal w-full text-left"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-purple-600 block px-3 py-2 text-base font-normal w-full text-left"
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
  );
}

export default Navigation;
