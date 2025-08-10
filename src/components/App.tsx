import { useState } from 'hono/jsx';
import HomePage from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { AuthPage } from '@/pages/Auth';
import { GetStarted } from '@/pages/GetStarted';

type PageType = 'home' | 'dashboard' | 'auth' | 'get-started';

export function App() {
    const [currentPage, setCurrentPage] = useState<PageType>('home');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleGetStarted = () => {
        if (isAuthenticated) {
            setCurrentPage('dashboard');
        } else {
            setCurrentPage('get-started');
        }
    };

    const handleAuth = () => {
        setCurrentPage('auth');
    };

    const handleLogin = () => {
        setIsAuthenticated(true);
        setCurrentPage('dashboard');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentPage('home');
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onGetStarted={handleGetStarted} />;
            case 'dashboard':
                return <Dashboard onLogout={handleLogout} />;
            case 'auth':
                return <AuthPage onSuccess={handleLogin} onBack={() => setCurrentPage('home')} />;
            case 'get-started':
                return <GetStarted onAuth={handleAuth} onBack={() => setCurrentPage('home')} />;
            default:
                return <HomePage onGetStarted={handleGetStarted} />;
        }
    };

    return (
        <div className="app">
            {renderCurrentPage()}
        </div>
    );
}