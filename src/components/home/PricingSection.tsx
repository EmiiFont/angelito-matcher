import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Gift } from 'lucide-react';

interface PricingSectionProps {
  onGetStarted?: () => void;
}

export function PricingSection({ onGetStarted }: PricingSectionProps) {
  return (
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
  );
}

export default PricingSection;
