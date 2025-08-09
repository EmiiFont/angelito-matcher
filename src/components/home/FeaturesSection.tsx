import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail, Shield, Gift, CheckCircle, Star } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 dark:text-white mb-4">
            Everything You Need for Perfect Gift Exchanges
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From simple Secret Santa to complex corporate events, our platform handles all the details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-purple-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Smart Matching</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Intelligent algorithm ensures fair matches while respecting all exclusions and preferences
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Automated Notifications</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Send match assignments via WhatsApp, SMS, or email with customizable messages
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Complete Privacy</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maintains secrecy - only the system knows all pairings, ensuring surprise is preserved
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Budget Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set spending limits and gift preferences to ensure everyone's comfort and participation
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Admin Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive event management with real-time status updates and participant tracking
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-800/50 transition-shadow bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 dark:text-white mb-2">Custom Restrictions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Handle complex scenarios like family exclusions, office hierarchies, and special preferences
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
