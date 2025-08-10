import { useState } from 'hono/jsx';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Gift, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';

interface AuthPageProps {
    onSuccess: () => void;
    onBack: () => void;
}

export function AuthPage({ onSuccess, onBack }: AuthPageProps) {
    const [isSignUp, setIsSignUp] = useState(false);

    const handleSuccess = () => {
        onSuccess();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
            {/* Navigation */}
            <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-purple-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Gift className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            <span className="ml-2 text-xl font-normal text-gray-900 dark:text-white">{APP_NAME}</span>
                        </div>

                        <div className="flex items-center space-x-3">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                onClick={onBack}
                                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                            <Gift className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-normal text-slate-900 dark:text-white mb-2">
                            {isSignUp ? 'Get Started' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isSignUp
                                ? 'Create your account to start organizing amazing gift exchanges'
                                : 'Sign in to your account to continue organizing gift exchanges'
                            }
                        </p>
                    </div>

                    {/* Auth Forms */}
                    {isSignUp ? (
                        <SignUpForm
                            onSuccess={handleSuccess}
                            onToggleMode={() => setIsSignUp(false)}
                        />
                    ) : (
                        <SignInForm
                            onSuccess={handleSuccess}
                            onToggleMode={() => setIsSignUp(true)}
                        />
                    )}

                    {/* Features Preview - Only show on Sign Up */}
                    {isSignUp && (
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Smart Matching</p>
                            </div>
                            <div>
                                <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Auto Notifications</p>
                            </div>
                            <div>
                                <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                                <p className="text-xs text-gray-600">Complete Privacy</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
