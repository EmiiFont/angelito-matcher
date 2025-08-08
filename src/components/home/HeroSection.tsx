import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Mail, Shield, Users } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-normal tracking-tight text-slate-900 sm:text-7xl mb-6">
            Simplify your{' '}
            <span className="relative whitespace-nowrap text-purple-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-red-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.433 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
              </svg>
              <span className="relative">gift exchange</span>
            </span>{' '}
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
                  <h3 className="text-2xl font-normal">Christmas Party 2024</h3>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>24 participants</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 rounded-lg p-4">
                    <Gift className="h-8 w-8 mb-2" />
                    <p className="font-normal">Matches Generated</p>
                    <p className="text-sm opacity-90">All participants matched</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Mail className="h-8 w-8 mb-2" />
                    <p className="font-normal">Notifications Sent</p>
                    <p className="text-sm opacity-90">Via email & SMS</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <Shield className="h-8 w-8 mb-2" />
                    <p className="font-normal">Privacy Protected</p>
                    <p className="text-sm opacity-90">Complete anonymity</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
